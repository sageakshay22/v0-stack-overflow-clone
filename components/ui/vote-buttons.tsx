"use client"

import { useState } from "react"
import { ChevronUp, ChevronDown, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { vote } from "@/lib/actions"

interface VoteButtonsProps {
  contentId: string
  contentType: "question" | "answer"
  initialVoteCount: number
  isAccepted?: boolean
  showAcceptButton?: boolean
  onAccept?: () => void
  isAcceptLoading?: boolean
  orientation?: "vertical" | "horizontal"
}

export function VoteButtons({
  contentId,
  contentType,
  initialVoteCount,
  isAccepted = false,
  showAcceptButton = false,
  onAccept,
  isAcceptLoading = false,
  orientation = "vertical",
}: VoteButtonsProps) {
  const [voteCount, setVoteCount] = useState(initialVoteCount)
  const [userVote, setUserVote] = useState<1 | -1 | 0>(0)
  const [isVoting, setIsVoting] = useState(false)

  const handleVote = async (value: 1 | -1) => {
    setIsVoting(true)
    try {
      const result = await vote(contentId, contentType, value)
      if (result.success && result.newVoteCount !== undefined) {
        setVoteCount(result.newVoteCount)
        setUserVote(userVote === value ? 0 : value)
      }
    } catch (error) {
      console.error("Failed to vote:", error)
    } finally {
      setIsVoting(false)
    }
  }

  const handleUpvote = () => handleVote(1)
  const handleDownvote = () => handleVote(-1)

  const isVertical = orientation === "vertical"

  return (
    <div className={cn("flex items-center gap-1", isVertical ? "flex-col" : "flex-row")}>
      <Button
        variant="ghost"
        size="icon"
        className={cn("h-9 w-9 rounded-full", userVote === 1 && "bg-primary/10 text-primary")}
        onClick={handleUpvote}
        disabled={isVoting}
        aria-label="Upvote"
      >
        {isVoting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronUp className="h-6 w-6" />}
      </Button>

      <span
        className={cn(
          "text-xl font-semibold tabular-nums",
          voteCount > 0 && "text-success",
          voteCount < 0 && "text-destructive",
          voteCount === 0 && "text-muted-foreground",
        )}
      >
        {voteCount}
      </span>

      <Button
        variant="ghost"
        size="icon"
        className={cn("h-9 w-9 rounded-full", userVote === -1 && "bg-destructive/10 text-destructive")}
        onClick={handleDownvote}
        disabled={isVoting}
        aria-label="Downvote"
      >
        <ChevronDown className="h-6 w-6" />
      </Button>

      {showAcceptButton && (
        <Button
          variant="ghost"
          size="icon"
          className={cn("mt-2 h-9 w-9 rounded-full", isAccepted && "bg-success/10 text-success")}
          onClick={onAccept}
          disabled={isAcceptLoading}
          aria-label={isAccepted ? "Accepted answer" : "Accept this answer"}
        >
          {isAcceptLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className={cn("h-5 w-5", isAccepted && "stroke-[3]")} />
          )}
        </Button>
      )}
    </div>
  )
}
