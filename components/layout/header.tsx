"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Menu, X, Bell, User, LogOut, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock current user - in production this would come from auth
const mockCurrentUser = {
  id: "user-1",
  username: "priya_kumar",
  reputation: 15420,
  avatarUrl: null,
}

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/tags", label: "Tags" },
    { href: "/users", label: "Users" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">TF</span>
          </div>
          <span className="hidden font-semibold text-foreground sm:inline-block">SMVITM Forum</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === link.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search Bar */}
        <div
          className={cn(
            "flex flex-1 items-center justify-center",
            isSearchOpen ? "absolute inset-x-0 top-0 z-50 h-14 bg-background px-4" : "",
          )}
        >
          {isSearchOpen && (
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 shrink-0 md:hidden"
              onClick={() => setIsSearchOpen(false)}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close search</span>
            </Button>
          )}
          <div className={cn("relative w-full max-w-md", isSearchOpen ? "flex" : "hidden md:flex")}>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="search" placeholder="Search questions..." className="w-full pl-9 pr-4" />
          </div>
          {!isSearchOpen && (
            <Button variant="ghost" size="icon" className="shrink-0 md:hidden" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Open search</span>
            </Button>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative hidden sm:flex">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              3
            </span>
            <span className="sr-only">Notifications</span>
          </Button>

          {/* Ask Question Button */}
          <Button asChild size="sm" className="hidden sm:flex">
            <Link href="/ask">Ask Question</Link>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-4 w-4" />
                </div>
                <span className="hidden text-xs font-medium text-muted-foreground lg:inline-block">
                  {mockCurrentUser.reputation.toLocaleString()}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center gap-2 p-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{mockCurrentUser.username}</span>
                  <span className="text-xs text-muted-foreground">
                    {mockCurrentUser.reputation.toLocaleString()} reputation
                  </span>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/users/${mockCurrentUser.id}`} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="flex flex-col p-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-border pt-2">
              <Button asChild className="w-full">
                <Link href="/ask" onClick={() => setIsMobileMenuOpen(false)}>
                  Ask Question
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
