import Link from "next/link"
import { cn } from "@/lib/utils"

interface TagBadgeProps {
  tag: string
  count?: number
  size?: "sm" | "md"
  interactive?: boolean
}

export function TagBadge({ tag, count, size = "sm", interactive = true }: TagBadgeProps) {
  const className = cn(
    "inline-flex items-center gap-1 rounded-md font-medium transition-colors",
    size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
    interactive ? "bg-primary/10 text-primary hover:bg-primary/20" : "bg-primary/10 text-primary",
  )

  if (interactive) {
    return (
      <Link href={`/tags/${tag}`} className={className}>
        {tag}
        {count !== undefined && <span className="text-primary/70">× {count.toLocaleString()}</span>}
      </Link>
    )
  }

  return (
    <span className={className}>
      {tag}
      {count !== undefined && <span className="text-primary/70">× {count.toLocaleString()}</span>}
    </span>
  )
}
