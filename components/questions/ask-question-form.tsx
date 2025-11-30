"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { X, Lightbulb, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MarkdownContent } from "@/components/ui/markdown-content"
import { cn } from "@/lib/utils"
import { createQuestion } from "@/lib/actions"
import type { Tag } from "@/lib/types"

interface AskQuestionFormProps {
  availableTags: Tag[]
}

export function AskQuestionForm({ availableTags }: AskQuestionFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Suggested tags based on input
  const suggestedTags = tagInput
    ? availableTags
        .filter((t) => t.name.toLowerCase().includes(tagInput.toLowerCase()) && !tags.includes(t.name))
        .slice(0, 5)
    : []

  const addTag = (tag: string) => {
    const normalizedTag = tag.toLowerCase().trim()
    if (normalizedTag && !tags.includes(normalizedTag) && tags.length < 5) {
      setTags([...tags, normalizedTag])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove))
  }

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag(tagInput)
    }
    if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      removeTag(tags[tags.length - 1])
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (title.length < 15) {
      newErrors.title = "Title must be at least 15 characters long"
    }
    if (title.length > 150) {
      newErrors.title = "Title cannot exceed 150 characters"
    }
    if (body.length < 30) {
      newErrors.body = "Body must be at least 30 characters long"
    }
    if (tags.length === 0) {
      newErrors.tags = "Please add at least one tag"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setIsSubmitting(true)

    const result = await createQuestion({ title, body, tags })

    if (result.error) {
      setErrors({ submit: result.error })
      setIsSubmitting(false)
      return
    }

    if (result.success && result.questionId) {
      router.push(`/questions/${result.questionId}`)
    } else {
      router.push("/")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Ask a public question</h1>
        <p className="mt-1 text-muted-foreground">
          Get help from the SMVITM community by asking a well-crafted question.
        </p>
      </div>

      {/* Tips Card */}
      <Alert className="border-primary/20 bg-primary/5">
        <Lightbulb className="h-4 w-4 text-primary" />
        <AlertDescription className="text-sm">
          <strong className="font-semibold">Writing a good question</strong>
          <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
            <li>Summarize your problem in a one-line title</li>
            <li>Describe what you tried and what you expected to happen</li>
            <li>Add relevant tags to help others find your question</li>
            <li>Include code snippets if applicable (use markdown formatting)</li>
          </ul>
        </AlertDescription>
      </Alert>

      {errors.submit && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errors.submit}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-base font-semibold">
            Title
          </Label>
          <p className="text-sm text-muted-foreground">
            Be specific and imagine you're asking a question to another person.
          </p>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., How to implement authentication with Next.js and Supabase?"
            className={cn(errors.title && "border-destructive")}
          />
          <div className="flex justify-between text-xs">
            {errors.title ? (
              <span className="flex items-center gap-1 text-destructive">
                <AlertCircle className="h-3 w-3" />
                {errors.title}
              </span>
            ) : (
              <span className="text-muted-foreground">
                {title.length < 15 ? `${15 - title.length} more characters needed` : "Good title length"}
              </span>
            )}
            <span className="text-muted-foreground">{title.length}/150</span>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-2">
          <Label htmlFor="body" className="text-base font-semibold">
            Body
          </Label>
          <p className="text-sm text-muted-foreground">
            Include all the information someone would need to answer your question.
          </p>
          <Tabs defaultValue="write">
            <TabsList>
              <TabsTrigger value="write">Write</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="write" className="mt-2">
              <Textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={`Describe your problem in detail...

What have you tried so far?

\`\`\`typescript
// Include relevant code here
\`\`\`

What was the expected vs actual result?`}
                className={cn("min-h-[300px] font-mono text-sm", errors.body && "border-destructive")}
              />
            </TabsContent>
            <TabsContent value="preview" className="mt-2">
              <div className="min-h-[300px] rounded-md border border-border bg-muted/30 p-4">
                {body ? (
                  <MarkdownContent content={body} />
                ) : (
                  <p className="text-muted-foreground">
                    Nothing to preview yet. Start typing to see your question rendered.
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex justify-between text-xs">
            {errors.body ? (
              <span className="flex items-center gap-1 text-destructive">
                <AlertCircle className="h-3 w-3" />
                {errors.body}
              </span>
            ) : (
              <span className="text-muted-foreground">Supports Markdown formatting</span>
            )}
            <span className="text-muted-foreground">{body.length} characters</span>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label htmlFor="tags" className="text-base font-semibold">
            Tags
          </Label>
          <p className="text-sm text-muted-foreground">Add up to 5 tags to describe what your question is about.</p>
          <div
            className={cn(
              "flex flex-wrap items-center gap-2 rounded-md border border-input bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-ring",
              errors.tags && "border-destructive",
            )}
          >
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-sm font-medium text-primary"
              >
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="rounded-sm hover:bg-primary/20">
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {tag} tag</span>
                </button>
              </span>
            ))}
            <input
              id="tags"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder={tags.length === 0 ? "e.g., react, typescript, nextjs" : ""}
              className="min-w-[120px] flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              disabled={tags.length >= 5}
            />
          </div>

          {/* Tag Suggestions */}
          {suggestedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-xs text-muted-foreground">Suggestions:</span>
              {suggestedTags.map((tag) => (
                <button
                  key={tag.name}
                  type="button"
                  onClick={() => addTag(tag.name)}
                  className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  {tag.name}
                  <span className="opacity-60">×{tag.count}</span>
                </button>
              ))}
            </div>
          )}

          <div className="flex justify-between text-xs">
            {errors.tags ? (
              <span className="flex items-center gap-1 text-destructive">
                <AlertCircle className="h-3 w-3" />
                {errors.tags}
              </span>
            ) : (
              <span className="text-muted-foreground">Press Enter or comma to add a tag</span>
            )}
            <span className="text-muted-foreground">{tags.length}/5 tags</span>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4 border-t border-border pt-6">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Posting question..." : "Post your question"}
          </Button>
          <Button type="button" variant="ghost" size="lg" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
