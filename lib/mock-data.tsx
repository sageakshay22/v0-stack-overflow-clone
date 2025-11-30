import type { User, Question, Answer, Tag } from "./types"

export const mockUsers: User[] = [
  {
    id: "user-1",
    username: "priya_kumar",
    reputation: 15420,
    badges: [
      { name: "Gold Badge", type: "gold", description: "Earned for 100 answers" },
      { name: "Silver Badge", type: "silver", description: "Earned for 50 upvotes" },
      { name: "Bronze Badge", type: "bronze", description: "First answer" },
    ],
    joinedAt: new Date("2023-01-15"),
    bio: "Full-stack developer passionate about React and Node.js",
    location: "Bantakal, Karnataka",
  },
  {
    id: "user-2",
    username: "rahul_dev",
    reputation: 8750,
    badges: [
      { name: "Silver Badge", type: "silver", description: "Earned for 50 upvotes" },
      { name: "Bronze Badge", type: "bronze", description: "First question" },
    ],
    joinedAt: new Date("2023-03-22"),
    bio: "CS student exploring machine learning and data science",
    location: "Udupi, Karnataka",
  },
  {
    id: "user-3",
    username: "ananya_s",
    reputation: 3200,
    badges: [{ name: "Bronze Badge", type: "bronze", description: "First answer" }],
    joinedAt: new Date("2023-06-10"),
    bio: "Backend developer learning cloud technologies",
    location: "Mangalore, Karnataka",
  },
  {
    id: "user-4",
    username: "vikram_rao",
    reputation: 12800,
    badges: [
      { name: "Gold Badge", type: "gold", description: "Earned for excellent contributions" },
      { name: "Silver Badge", type: "silver", description: "Earned for helpful answers" },
    ],
    joinedAt: new Date("2022-11-05"),
    bio: "Senior developer specializing in distributed systems",
    location: "Bangalore, Karnataka",
  },
  {
    id: "user-5",
    username: "sneha_nair",
    reputation: 5600,
    badges: [
      { name: "Silver Badge", type: "silver", description: "Consistent contributor" },
      { name: "Bronze Badge", type: "bronze", description: "First question" },
    ],
    joinedAt: new Date("2023-02-18"),
    bio: "Frontend enthusiast with a love for clean UI/UX",
    location: "Manipal, Karnataka",
  },
]

export const mockQuestions: Question[] = [
  {
    id: "q-1",
    userId: "user-1",
    title: "How to implement authentication with Next.js 14 and Supabase?",
    body: `I'm trying to set up authentication in my Next.js 14 application using Supabase. I've followed the documentation but I'm running into issues with the session management.

Here's what I've tried so far:

\`\`\`typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
\`\`\`

The login seems to work but the session doesn't persist across page refreshes. What am I missing?

**Expected behavior:** User should stay logged in after page refresh
**Actual behavior:** User is logged out after every refresh

Any help would be appreciated!`,
    tags: ["nextjs", "supabase", "authentication", "react"],
    createdAt: new Date("2024-01-15T10:30:00"),
    voteCount: 42,
    answerCount: 3,
    viewCount: 1250,
    user: mockUsers[0],
    acceptedAnswerId: "a-1",
  },
  {
    id: "q-2",
    userId: "user-2",
    title: "Understanding React Server Components vs Client Components",
    body: `I'm confused about when to use Server Components vs Client Components in Next.js 14. 

Can someone explain:
1. What are the key differences?
2. When should I use each?
3. How do they affect performance?

I've read the docs but practical examples would really help me understand better.`,
    tags: ["react", "nextjs", "server-components"],
    createdAt: new Date("2024-01-14T15:45:00"),
    voteCount: 89,
    answerCount: 5,
    viewCount: 3420,
    user: mockUsers[1],
  },
  {
    id: "q-3",
    userId: "user-3",
    title: "Best practices for PostgreSQL database indexing?",
    body: `I have a table with millions of rows and queries are becoming slow. What are the best practices for creating indexes in PostgreSQL?

My table structure:
\`\`\`sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  product_id INTEGER,
  created_at TIMESTAMP,
  status VARCHAR(50),
  total_amount DECIMAL(10,2)
);
\`\`\`

Common queries include:
- Finding orders by user_id
- Filtering by status and date range
- Sorting by created_at

What indexes should I create?`,
    tags: ["postgresql", "database", "performance", "indexing"],
    createdAt: new Date("2024-01-13T09:15:00"),
    voteCount: 56,
    answerCount: 4,
    viewCount: 2100,
    user: mockUsers[2],
  },
  {
    id: "q-4",
    userId: "user-4",
    title: "TypeScript generics - How to create a type-safe API client?",
    body: `I want to create a type-safe API client in TypeScript that automatically infers response types based on the endpoint.

Something like:
\`\`\`typescript
const user = await api.get('/users/1') // Should be typed as User
const posts = await api.get('/posts') // Should be typed as Post[]
\`\`\`

How can I achieve this with TypeScript generics?`,
    tags: ["typescript", "generics", "api", "type-safety"],
    createdAt: new Date("2024-01-12T14:20:00"),
    voteCount: 73,
    answerCount: 2,
    viewCount: 1890,
    user: mockUsers[3],
  },
  {
    id: "q-5",
    userId: "user-5",
    title: "Tailwind CSS - How to create a custom design system?",
    body: `I'm working on a project that requires a custom design system with specific colors, spacing, and typography. How can I extend Tailwind CSS to accommodate this?

I need:
- Custom color palette with primary, secondary, accent colors
- Custom spacing scale
- Custom font sizes with specific line heights

What's the best approach to organize this in Tailwind v4?`,
    tags: ["tailwindcss", "css", "design-system", "frontend"],
    createdAt: new Date("2024-01-11T11:00:00"),
    voteCount: 34,
    answerCount: 3,
    viewCount: 980,
    user: mockUsers[4],
  },
  {
    id: "q-6",
    userId: "user-1",
    title: "How to optimize React component re-renders?",
    body: `My React application is experiencing performance issues due to excessive re-renders. I've tried using React.memo but it doesn't seem to help in all cases.

What are the best strategies for:
1. Identifying unnecessary re-renders
2. Optimizing component performance
3. Using useMemo and useCallback effectively`,
    tags: ["react", "performance", "optimization"],
    createdAt: new Date("2024-01-10T16:30:00"),
    voteCount: 61,
    answerCount: 4,
    viewCount: 2340,
    user: mockUsers[0],
  },
]

export const mockAnswers: Answer[] = [
  {
    id: "a-1",
    questionId: "q-1",
    userId: "user-4",
    body: `The issue you're facing is because you're not properly handling the session on the server side in Next.js 14.

You need to use the \`@supabase/ssr\` package instead:

\`\`\`typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
\`\`\`

Also, make sure you have middleware set up to refresh the session:

\`\`\`typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  // ... middleware code to refresh session
}
\`\`\`

This should fix your session persistence issue!`,
    createdAt: new Date("2024-01-15T12:00:00"),
    voteCount: 28,
    isAccepted: true,
    user: mockUsers[3],
  },
  {
    id: "a-2",
    questionId: "q-1",
    userId: "user-2",
    body: `Adding to the above answer, you might also want to check your Supabase project settings. Make sure:

1. Your site URL is correctly configured in Authentication > URL Configuration
2. Redirect URLs include your localhost for development

Also, consider using the \`onAuthStateChange\` listener on the client side to handle auth state changes.`,
    createdAt: new Date("2024-01-15T14:30:00"),
    voteCount: 12,
    isAccepted: false,
    user: mockUsers[1],
  },
  {
    id: "a-3",
    questionId: "q-2",
    userId: "user-1",
    body: `Great question! Here's a practical breakdown:

## Server Components (Default in Next.js 14)
- Render on the server
- Can directly access backend resources (database, file system)
- Don't increase client-side JavaScript bundle
- Can't use hooks like useState, useEffect

## Client Components
- Render on the client (after initial server render)
- Can use React hooks and browser APIs
- Required for interactivity (clicks, inputs, etc.)

**Rule of thumb:** Start with Server Components, only switch to Client Components when you need interactivity or browser APIs.

\`\`\`tsx
// Server Component (default)
async function UserProfile({ userId }) {
  const user = await db.users.findById(userId) // Direct DB access!
  return <div>{user.name}</div>
}

// Client Component
'use client'
function LikeButton() {
  const [liked, setLiked] = useState(false)
  return <button onClick={() => setLiked(!liked)}>Like</button>
}
\`\`\``,
    createdAt: new Date("2024-01-14T17:00:00"),
    voteCount: 45,
    isAccepted: false,
    user: mockUsers[0],
  },
]

export const mockTags: Tag[] = [
  { name: "javascript", count: 2456, description: "For questions about programming in JavaScript" },
  { name: "react", count: 1892, description: "A JavaScript library for building user interfaces" },
  { name: "nextjs", count: 1234, description: "The React Framework for the Web" },
  { name: "typescript", count: 1567, description: "TypeScript is a typed superset of JavaScript" },
  { name: "python", count: 1123, description: "Python is a multi-paradigm programming language" },
  { name: "nodejs", count: 987, description: "Node.js is a JavaScript runtime built on Chrome's V8" },
  { name: "css", count: 876, description: "Cascading Style Sheets for styling web pages" },
  { name: "tailwindcss", count: 654, description: "A utility-first CSS framework" },
  { name: "postgresql", count: 543, description: "Open source object-relational database system" },
  { name: "supabase", count: 432, description: "Open source Firebase alternative" },
  { name: "authentication", count: 321, description: "Questions about user authentication" },
  { name: "api", count: 298, description: "Application Programming Interface" },
  { name: "database", count: 276, description: "Questions about database design and queries" },
  { name: "performance", count: 234, description: "Optimizing application performance" },
  { name: "git", count: 212, description: "Version control system" },
  { name: "docker", count: 198, description: "Container platform for applications" },
]

export function getQuestionById(id: string): Question | undefined {
  return mockQuestions.find((q) => q.id === id)
}

export function getAnswersByQuestionId(questionId: string): Answer[] {
  return mockAnswers.filter((a) => a.questionId === questionId)
}

export function getUserById(id: string): User | undefined {
  return mockUsers.find((u) => u.id === id)
}

export function getQuestionsByUserId(userId: string): Question[] {
  return mockQuestions.filter((q) => q.userId === userId)
}

export function getAnswersByUserId(userId: string): Answer[] {
  return mockAnswers.filter((a) => a.userId === userId)
}

export function getQuestionsByTag(tag: string): Question[] {
  return mockQuestions.filter((q) => q.tags.includes(tag))
}
