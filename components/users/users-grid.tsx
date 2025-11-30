"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { User as UserType } from "@/lib/types"

type SortOption = "reputation" | "newest" | "name"

interface UsersGridProps {
  initialUsers: UserType[]
}

export function UsersGrid({ initialUsers }: UsersGridProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("reputation")

  const filteredUsers = initialUsers
    .filter((user) => user.username.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.username.localeCompare(b.username)
        case "newest":
          return new Date(b.joined_at).getTime() - new Date(a.joined_at).getTime()
        case "reputation":
        default:
          return b.reputation - a.reputation
      }
    })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Users</h1>
        <p className="mt-1 text-muted-foreground">Browse and connect with members of the SMVITM technical community.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Filter by username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
          <TabsList>
            <TabsTrigger value="reputation">Reputation</TabsTrigger>
            <TabsTrigger value="newest">New Users</TabsTrigger>
            <TabsTrigger value="name">Name</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Users Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredUsers.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">No users found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  )
}

function UserCard({ user }: { user: UserType }) {
  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "numeric",
    }).format(new Date(dateStr))
  }

  const goldBadges = user.badges?.filter((b) => b.type === "gold").length || 0
  const silverBadges = user.badges?.filter((b) => b.type === "silver").length || 0
  const bronzeBadges = user.badges?.filter((b) => b.type === "bronze").length || 0

  return (
    <Link
      href={`/users/${user.id}`}
      className="group flex gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-sm"
    >
      {/* Avatar */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
        <User className="h-6 w-6" />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-medium text-primary group-hover:text-primary/80">{user.username}</h3>
        <p className="text-sm font-semibold text-foreground">{user.reputation.toLocaleString()}</p>
        {user.location && <p className="truncate text-xs text-muted-foreground">{user.location}</p>}

        {/* Badges */}
        {user.badges && user.badges.length > 0 && (
          <div className="mt-2 flex items-center gap-2">
            {goldBadges > 0 && (
              <span className="flex items-center gap-0.5 text-xs">
                <span className="h-2 w-2 rounded-full bg-yellow-500" />
                <span className="text-muted-foreground">{goldBadges}</span>
              </span>
            )}
            {silverBadges > 0 && (
              <span className="flex items-center gap-0.5 text-xs">
                <span className="h-2 w-2 rounded-full bg-gray-400" />
                <span className="text-muted-foreground">{silverBadges}</span>
              </span>
            )}
            {bronzeBadges > 0 && (
              <span className="flex items-center gap-0.5 text-xs">
                <span className="h-2 w-2 rounded-full bg-amber-600" />
                <span className="text-muted-foreground">{bronzeBadges}</span>
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
