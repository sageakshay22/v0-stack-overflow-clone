"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createQuestion(data: {
  title: string
  body: string
  tags: string[]
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to ask a question" }
  }

  const { data: question, error } = await supabase
    .from("questions")
    .insert({
      user_id: user.id,
      title: data.title,
      body: data.body,
      tags: data.tags,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating question:", error)
    return { error: error.message }
  }

  revalidatePath("/")
  return { success: true, questionId: question.id }
}

export async function createAnswer(questionId: string, body: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to answer" }
  }

  const { data: answer, error } = await supabase
    .from("answers")
    .insert({
      question_id: questionId,
      user_id: user.id,
      body: body,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating answer:", error)
    return { error: error.message }
  }

  // Update answer count on question
  await supabase.rpc("increment_answer_count", { q_id: questionId }).catch(() => {
    // Ignore if function doesn't exist
  })

  revalidatePath(`/questions/${questionId}`)
  return { success: true, answerId: answer.id }
}

export async function vote(contentId: string, contentType: "question" | "answer", voteValue: 1 | -1) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to vote" }
  }

  // Check if user already voted
  const { data: existingVote } = await supabase
    .from("votes")
    .select("*")
    .eq("user_id", user.id)
    .eq("content_id", contentId)
    .eq("content_type", contentType)
    .single()

  let newVoteCount: number

  if (existingVote) {
    if (existingVote.vote_value === voteValue) {
      // Remove vote
      await supabase.from("votes").delete().eq("id", existingVote.id)

      // Update vote count
      const table = contentType === "question" ? "questions" : "answers"
      const { data: updated } = await supabase
        .from(table)
        .update({ vote_count: existingVote.vote_value === 1 ? -1 : 1 })
        .eq("id", contentId)
        .select("vote_count")
        .single()

      // Get current vote count
      const { data: current } = await supabase.from(table).select("vote_count").eq("id", contentId).single()

      newVoteCount = current?.vote_count ?? 0
    } else {
      // Change vote
      await supabase.from("votes").update({ vote_value: voteValue }).eq("id", existingVote.id)

      // Update vote count (change by 2: remove old vote, add new)
      const table = contentType === "question" ? "questions" : "answers"
      const { data: current } = await supabase.from(table).select("vote_count").eq("id", contentId).single()

      const change = voteValue === 1 ? 2 : -2
      await supabase
        .from(table)
        .update({ vote_count: (current?.vote_count ?? 0) + change })
        .eq("id", contentId)

      newVoteCount = (current?.vote_count ?? 0) + change
    }
  } else {
    // Create new vote
    await supabase.from("votes").insert({
      user_id: user.id,
      content_id: contentId,
      content_type: contentType,
      vote_value: voteValue,
    })

    // Update vote count
    const table = contentType === "question" ? "questions" : "answers"
    const { data: current } = await supabase.from(table).select("vote_count").eq("id", contentId).single()

    await supabase
      .from(table)
      .update({ vote_count: (current?.vote_count ?? 0) + voteValue })
      .eq("id", contentId)

    newVoteCount = (current?.vote_count ?? 0) + voteValue
  }

  return { success: true, newVoteCount }
}

export async function acceptAnswer(questionId: string, answerId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in" }
  }

  // Verify user owns the question
  const { data: question } = await supabase
    .from("questions")
    .select("user_id, accepted_answer_id")
    .eq("id", questionId)
    .single()

  if (!question || question.user_id !== user.id) {
    return { error: "Only the question owner can accept an answer" }
  }

  // Toggle accept status
  const isCurrentlyAccepted = question.accepted_answer_id === answerId

  // Unaccept previous answer if different
  if (question.accepted_answer_id && question.accepted_answer_id !== answerId) {
    await supabase.from("answers").update({ is_accepted: false }).eq("id", question.accepted_answer_id)
  }

  // Update answer
  await supabase.from("answers").update({ is_accepted: !isCurrentlyAccepted }).eq("id", answerId)

  // Update question's accepted_answer_id
  await supabase
    .from("questions")
    .update({ accepted_answer_id: isCurrentlyAccepted ? null : answerId })
    .eq("id", questionId)

  revalidatePath(`/questions/${questionId}`)
  return { success: true }
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}
