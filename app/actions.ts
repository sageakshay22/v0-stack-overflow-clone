"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createQuestion(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "You must be logged in to ask a question" }
  }

  const title = formData.get("title") as string
  const body = formData.get("body") as string
  const tagsString = formData.get("tags") as string
  const tags = tagsString
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)

  if (!title || !body || tags.length === 0) {
    return { error: "Please fill in all required fields" }
  }

  const { data, error } = await supabase
    .from("questions")
    .insert({
      user_id: user.id,
      title,
      body,
      tags,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating question:", error)
    return { error: "Failed to create question" }
  }

  revalidatePath("/")
  redirect(`/questions/${data.id}`)
}

export async function createAnswer(questionId: string, formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "You must be logged in to answer" }
  }

  const body = formData.get("body") as string

  if (!body) {
    return { error: "Answer body is required" }
  }

  const { error } = await supabase.from("answers").insert({
    question_id: questionId,
    user_id: user.id,
    body,
  })

  if (error) {
    console.error("Error creating answer:", error)
    return { error: "Failed to create answer" }
  }

  // Update answer count
  await supabase.rpc("increment_answer_count", { question_id: questionId }).catch(() => {
    // Fallback if function doesn't exist
    supabase
      .from("questions")
      .update({ answer_count: supabase.rpc("get_answer_count", { qid: questionId }) })
      .eq("id", questionId)
  })

  revalidatePath(`/questions/${questionId}`)
  return { success: true }
}

export async function voteOnQuestion(questionId: string, voteValue: 1 | -1) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "You must be logged in to vote" }
  }

  const { data, error } = await supabase.rpc("vote_on_question", {
    p_user_id: user.id,
    p_question_id: questionId,
    p_vote_value: voteValue,
  })

  if (error) {
    console.error("Error voting:", error)
    return { error: "Failed to vote" }
  }

  revalidatePath(`/questions/${questionId}`)
  return data
}

export async function voteOnAnswer(answerId: string, questionId: string, voteValue: 1 | -1) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "You must be logged in to vote" }
  }

  const { data, error } = await supabase.rpc("vote_on_answer", {
    p_user_id: user.id,
    p_answer_id: answerId,
    p_vote_value: voteValue,
  })

  if (error) {
    console.error("Error voting:", error)
    return { error: "Failed to vote" }
  }

  revalidatePath(`/questions/${questionId}`)
  return data
}

export async function acceptAnswer(answerId: string, questionId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "You must be logged in" }
  }

  const { data, error } = await supabase.rpc("accept_answer", {
    p_user_id: user.id,
    p_answer_id: answerId,
  })

  if (error) {
    console.error("Error accepting answer:", error)
    return { error: "Failed to accept answer" }
  }

  revalidatePath(`/questions/${questionId}`)
  return data
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/")
}
