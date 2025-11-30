export interface User {
  id: string
  username: string
  reputation: number
  badges: Badge[]
  joined_at: string
  avatar_url?: string
  bio?: string
  location?: string
  website?: string
}

export interface Badge {
  name: string
  type: "gold" | "silver" | "bronze"
  description: string
}

export interface Question {
  id: string
  user_id: string
  title: string
  body: string
  tags: string[]
  created_at: string
  updated_at?: string
  vote_count: number
  answer_count: number
  view_count: number
  profiles?: User
  accepted_answer_id?: string
}

export interface Answer {
  id: string
  question_id: string
  user_id: string
  body: string
  created_at: string
  updated_at?: string
  vote_count: number
  is_accepted: boolean
  profiles?: User
  questions?: { id: string; title: string }
}

export interface Vote {
  id: string
  user_id: string
  content_id: string
  content_type: "question" | "answer"
  vote_value: 1 | -1
}

export interface Tag {
  name: string
  count: number
  description?: string
}
