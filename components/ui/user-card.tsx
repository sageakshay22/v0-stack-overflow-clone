import Link from "next/link"
import { User } from "lucide-react"
import type { User as UserType } from "@/lib/types"
import { cn } from "@/lib/utils"

interface UserCardProps {
  user: UserType
  showReputation?: boolean
  size?: "sm" | "md"
  timestamp?: string | Date
  label?: string
}

export function UserCard({ user, showReputation = true, size = "sm", timestamp, label }: UserCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    }).format(date)
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return formatDate(date)
  }

  const dateObj = timestamp ? (typeof timestamp === "string" ? new Date(timestamp) : timestamp) : null

  return (
    <div className={cn("flex items-center gap-2", size === "sm" ? "text-xs" : "text-sm")}>
      <Link
        href={`/users/${user.id}`}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors hover:bg-primary/20"
      >
        <User className="h-4 w-4" />
      </Link>
      <div className="flex flex-col">
        {dateObj && label && (
          <span className="text-muted-foreground">
            {label} {formatTimeAgo(dateObj)}
          </span>
        )}
        <div className="flex items-center gap-2">
          <Link href={`/users/${user.id}`} className="font-medium text-primary hover:text-primary/80">
            {user.username}
          </Link>
          {showReputation && <span className="font-semibold text-foreground">{user.reputation.toLocaleString()}</span>}
        </div>
      </div>
    </div>
  )
}
