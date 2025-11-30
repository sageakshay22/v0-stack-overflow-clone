"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarkdownContent } from "@/components/ui/markdown-content"

interface AnswerFormProps {
  questionId: string
}

export function AnswerForm({ questionId }: AnswerFormProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setContent("")
    // In production, you would submit to your backend here
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Your Answer</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Tabs defaultValue="write">
          <TabsList>
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="write" className="mt-2">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your answer here... (Markdown supported)"
              className="min-h-[200px] font-mono text-sm"
            />
          </TabsContent>
          <TabsContent value="preview" className="mt-2">
            <div className="min-h-[200px] rounded-md border border-border bg-muted/30 p-4">
              {content ? (
                <MarkdownContent content={content} />
              ) : (
                <p className="text-muted-foreground">
                  Nothing to preview yet. Start typing to see your answer rendered.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Supports Markdown formatting. Be specific and helpful.</p>
          <Button type="submit" disabled={!content.trim() || isSubmitting}>
            {isSubmitting ? "Posting..." : "Post Your Answer"}
          </Button>
        </div>
      </form>
    </section>
  )
}
