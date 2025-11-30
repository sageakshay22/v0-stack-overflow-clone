"use client"

import type React from "react"

import { cn } from "@/lib/utils"

interface MarkdownContentProps {
  content: string
  className?: string
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  // Simple markdown-like rendering
  // In production, use a proper markdown parser like react-markdown
  const renderContent = (text: string) => {
    const lines = text.split("\n")
    const elements: React.ReactNode[] = []
    let codeBlock: string[] = []
    let inCodeBlock = false
    let codeLanguage = ""

    lines.forEach((line, index) => {
      // Code block handling
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          elements.push(
            <pre key={`code-${index}`} className="my-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
              <code className={codeLanguage ? `language-${codeLanguage}` : ""}>{codeBlock.join("\n")}</code>
            </pre>,
          )
          codeBlock = []
          inCodeBlock = false
          codeLanguage = ""
        } else {
          inCodeBlock = true
          codeLanguage = line.slice(3).trim()
        }
        return
      }

      if (inCodeBlock) {
        codeBlock.push(line)
        return
      }

      // Headers
      if (line.startsWith("## ")) {
        elements.push(
          <h2 key={index} className="mb-2 mt-6 text-lg font-semibold text-foreground">
            {line.slice(3)}
          </h2>,
        )
        return
      }

      if (line.startsWith("# ")) {
        elements.push(
          <h1 key={index} className="mb-2 mt-6 text-xl font-bold text-foreground">
            {line.slice(2)}
          </h1>,
        )
        return
      }

      // List items
      if (line.startsWith("- ") || line.startsWith("* ")) {
        elements.push(
          <li key={index} className="ml-4 text-foreground">
            {renderInlineFormatting(line.slice(2))}
          </li>,
        )
        return
      }

      // Numbered list items
      const numberedMatch = line.match(/^\d+\.\s/)
      if (numberedMatch) {
        elements.push(
          <li key={index} className="ml-4 list-decimal text-foreground">
            {renderInlineFormatting(line.slice(numberedMatch[0].length))}
          </li>,
        )
        return
      }

      // Bold text
      if (line.startsWith("**") && line.endsWith("**")) {
        elements.push(
          <p key={index} className="my-2 font-semibold text-foreground">
            {line.slice(2, -2)}
          </p>,
        )
        return
      }

      // Empty lines
      if (line.trim() === "") {
        elements.push(<br key={index} />)
        return
      }

      // Regular paragraphs
      elements.push(
        <p key={index} className="my-2 leading-relaxed text-foreground">
          {renderInlineFormatting(line)}
        </p>,
      )
    })

    return elements
  }

  const renderInlineFormatting = (text: string): React.ReactNode => {
    // Inline code
    const parts = text.split(/(`[^`]+`)/g)
    return parts.map((part, i) => {
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code key={i} className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-primary">
            {part.slice(1, -1)}
          </code>
        )
      }
      // Bold
      const boldParts = part.split(/(\*\*[^*]+\*\*)/g)
      return boldParts.map((boldPart, j) => {
        if (boldPart.startsWith("**") && boldPart.endsWith("**")) {
          return (
            <strong key={`${i}-${j}`} className="font-semibold">
              {boldPart.slice(2, -2)}
            </strong>
          )
        }
        return boldPart
      })
    })
  }

  return <div className={cn("prose prose-sm max-w-none dark:prose-invert", className)}>{renderContent(content)}</div>
}
