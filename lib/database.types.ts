// Database types for Supabase
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          reputation: number
          badges: Json
          joined_at: string
          avatar_url: string | null
          bio: string | null
          location: string | null
          website: string | null
        }
        Insert: {
          id: string
          username: string
          reputation?: number
          badges?: Json
          joined_at?: string
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          website?: string | null
        }
        Update: {
          id?: string
          username?: string
          reputation?: number
          badges?: Json
          joined_at?: string
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          website?: string | null
        }
      }
      questions: {
        Row: {
          id: string
          user_id: string
          title: string
          body: string
          tags: string[]
          created_at: string
          updated_at: string | null
          vote_count: number
          answer_count: number
          view_count: number
          accepted_answer_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          body: string
          tags: string[]
          created_at?: string
          updated_at?: string | null
          vote_count?: number
          answer_count?: number
          view_count?: number
          accepted_answer_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          body?: string
          tags?: string[]
          created_at?: string
          updated_at?: string | null
          vote_count?: number
          answer_count?: number
          view_count?: number
          accepted_answer_id?: string | null
        }
      }
      answers: {
        Row: {
          id: string
          question_id: string
          user_id: string
          body: string
          created_at: string
          updated_at: string | null
          vote_count: number
          is_accepted: boolean
        }
        Insert: {
          id?: string
          question_id: string
          user_id: string
          body: string
          created_at?: string
          updated_at?: string | null
          vote_count?: number
          is_accepted?: boolean
        }
        Update: {
          id?: string
          question_id?: string
          user_id?: string
          body?: string
          created_at?: string
          updated_at?: string | null
          vote_count?: number
          is_accepted?: boolean
        }
      }
      votes: {
        Row: {
          id: string
          user_id: string
          content_id: string
          content_type: "question" | "answer"
          vote_value: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content_id: string
          content_type: "question" | "answer"
          vote_value: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content_id?: string
          content_type?: "question" | "answer"
          vote_value?: number
          created_at?: string
        }
      }
    }
    Functions: {
      vote_on_question: {
        Args: {
          p_user_id: string
          p_question_id: string
          p_vote_value: number
        }
        Returns: Json
      }
      vote_on_answer: {
        Args: {
          p_user_id: string
          p_answer_id: string
          p_vote_value: number
        }
        Returns: Json
      }
      accept_answer: {
        Args: {
          p_user_id: string
          p_answer_id: string
        }
        Returns: Json
      }
    }
  }
}

// Helper types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type Question = Database["public"]["Tables"]["questions"]["Row"]
export type Answer = Database["public"]["Tables"]["answers"]["Row"]
export type Vote = Database["public"]["Tables"]["votes"]["Row"]

// Extended types with joins
export type QuestionWithAuthor = Question & {
  profiles: Profile
}

export type AnswerWithAuthor = Answer & {
  profiles: Profile
}
