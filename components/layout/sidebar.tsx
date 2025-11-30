"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Tag, Users, HelpCircle, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/tags", label: "Tags", icon: Tag },
  { href: "/users", label: "Users", icon: Users },
  { href: "/unanswered", label: "Unanswered", icon: HelpCircle },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-44 shrink-0 md:block lg:w-52">
      <nav className="sticky top-[72px] flex flex-col gap-1">
        {sidebarLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "border-r-2 border-primary bg-primary/5 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export function RightSidebar() {
  const trendingTopics = [
    { tag: "nextjs", count: 156 },
    { tag: "react", count: 134 },
    { tag: "typescript", count: 98 },
    { tag: "supabase", count: 76 },
  ]

  return (
    <aside className="hidden w-72 shrink-0 lg:block">
      <div className="sticky top-[72px] space-y-6">
        {/* Trending Topics */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-card-foreground">
            <TrendingUp className="h-4 w-4 text-primary" />
            Trending Topics
          </div>
          <div className="space-y-2">
            {trendingTopics.map((topic) => (
              <Link
                key={topic.tag}
                href={`/tags/${topic.tag}`}
                className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
              >
                <span className="font-medium text-primary">#{topic.tag}</span>
                <span className="text-xs text-muted-foreground">{topic.count} questions</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Community Stats */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="mb-3 text-sm font-semibold text-card-foreground">Community Stats</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Questions</span>
              <span className="font-medium">2,456</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Answers</span>
              <span className="font-medium">8,123</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Users</span>
              <span className="font-medium">1,234</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
