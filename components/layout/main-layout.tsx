import type React from "react"
import { Header } from "./header"
import { Sidebar, RightSidebar } from "./sidebar"

interface MainLayoutProps {
  children: React.ReactNode
  showRightSidebar?: boolean
}

export function MainLayout({ children, showRightSidebar = true }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex gap-6">
          <Sidebar />
          <main className="min-w-0 flex-1">{children}</main>
          {showRightSidebar && <RightSidebar />}
        </div>
      </div>
    </div>
  )
}
