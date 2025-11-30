import { createClient } from "@/lib/supabase/server"
import type { QuestionWithAuthor, AnswerWithAuthor, Profile } from "@/lib/database.types"

export async function getQuestions(options?: {
  sort?: "newest" | "votes" | "unanswered"
  tag?: string
  limit?: number
}) {
  const supabase = await createClient()
  const { sort = "newest", tag, limit = 20 } = options || {}

  let query = supabase
    .from("questions")
    .select(`
      *,
      profiles (*)
    `)
    .limit(limit)

  if (tag) {
    query = query.contains("tags", [tag])
  }

  switch (sort) {
    case "votes":
      query = query.order("vote_count", { ascending: false })
      break
    case "unanswered":
      query = query.eq("answer_count", 0).order("created_at", { ascending: false })
      break
    default:
      query = query.order("created_at", { ascending: false })
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching questions:", error)
    return []
  }

  return data as QuestionWithAuthor[]
}

export async function getQuestionById(id: string) {
  const supabase = await createClient()

  // Increment view count
  await supabase.rpc("increment_view_count", { question_id: id }).catch(() => {
    // Ignore if function doesn't exist yet
  })

  const { data, error } = await supabase
    .from("questions")
    .select(`
      *,
      profiles (*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching question:", error)
    return null
  }

  return data as QuestionWithAuthor
}

export async function getAnswersByQuestionId(questionId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("answers")
    .select(`
      *,
      profiles (*)
    `)
    .eq("question_id", questionId)
    .order("is_accepted", { ascending: false })
    .order("vote_count", { ascending: false })
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching answers:", error)
    return []
  }

  return data as AnswerWithAuthor[]
}

export async function getProfileById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching profile:", error)
    return null
  }

  return data as Profile
}

export async function getProfiles(options?: { limit?: number; sort?: "reputation" | "newest" }) {
  const supabase = await createClient()
  const { limit = 20, sort = "reputation" } = options || {}

  let query = supabase.from("profiles").select("*").limit(limit)

  if (sort === "reputation") {
    query = query.order("reputation", { ascending: false })
  } else {
    query = query.order("joined_at", { ascending: false })
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching profiles:", error)
    return []
  }

  return data as Profile[]
}

export async function getAllTags() {
  const supabase = await createClient()

  const { data, error } = await supabase.from("questions").select("tags")

  if (error) {
    console.error("Error fetching tags:", error)
    return []
  }

  // Count tag occurrences
  const tagCounts: Record<string, number> = {}
  data?.forEach((question) => {
    question.tags?.forEach((tag: string) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })

  return Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

export async function getUserVote(userId: string, contentId: string, contentType: "question" | "answer") {
  const supabase = await createClient()

  const { data } = await supabase
    .from("votes")
    .select("vote_value")
    .eq("user_id", userId)
    .eq("content_id", contentId)
    .eq("content_type", contentType)
    .single()

  return data?.vote_value || 0
}

export async function getQuestionsByUserId(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("questions")
    .select(`*, profiles (*)`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user questions:", error)
    return []
  }

  return data as QuestionWithAuthor[]
}

export async function getAnswersByUserId(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("answers")
    .select(`*, profiles (*), questions (id, title)`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user answers:", error)
    return []
  }

  return data
}
