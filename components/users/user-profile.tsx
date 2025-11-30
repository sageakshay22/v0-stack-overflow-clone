"use client"

import { useState } from "react"
import Link from "next/link"
import { User, MapPin, Calendar, LinkIcon, Award, MessageSquare, HelpCircle, Check } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TagBadge } from "@/components/ui/tag-badge"
import type { User as UserType, Question, Answer } from "@/lib/types"
import { cn } from "@/lib/utils"

interface UserProfileProps {
  user: UserType
  questions: Question[]
  answers: Answer[]
}

export function UserProfile({ user, questions, answers }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState("summary")

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(date)
  }

  const goldBadges = user.badges.filter((b) => b.type === "gold").length
  const silverBadges = user.badges.filter((b) => b.type === "silver").length
  const bronzeBadges = user.badges.filter((b) => b.type === "bronze").length

  // Calculate stats
  const totalVotesReceived =
    questions.reduce((acc, q) => acc + q.voteCount, 0) + answers.reduce((acc, a) => acc + a.voteCount, 0)
  const acceptedAnswers = answers.filter((a) => a.isAccepted).length

  // Get all unique tags from questions
  const allTags = [...new Set(questions.flatMap((q) => q.tags))]
  const topTags = allTags.slice(0, 6)

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex flex-col gap-6 rounded-lg border border-border bg-card p-6 sm:flex-row">
        {/* Avatar */}
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-32 sm:w-32">
          <User className="h-12 w-12 sm:h-16 sm:w-16" />
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{user.username}</h1>
            {user.bio && <p className="mt-1 text-muted-foreground">{user.bio}</p>}
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            {user.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {user.location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Member since {formatDate(user.joinedAt)}
            </span>
            {user.website && (
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline"
              >
                <LinkIcon className="h-4 w-4" />
                Website
              </a>
            )}
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{user.reputation.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">reputation</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{questions.length}</div>
              <div className="text-xs text-muted-foreground">questions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{answers.length}</div>
              <div className="text-xs text-muted-foreground">answers</div>
            </div>
          </div>

          {/* Badges */}
          {user.badges.length > 0 && (
            <div className="flex items-center gap-4">
              {goldBadges > 0 && (
                <div className="flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">{goldBadges} gold</span>
                </div>
              )}
              {silverBadges > 0 && (
                <div className="flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium">{silverBadges} silver</span>
                </div>
              )}
              {bronzeBadges > 0 && (
                <div className="flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium">{bronzeBadges} bronze</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="questions">Questions ({questions.length})</TabsTrigger>
          <TabsTrigger value="answers">Answers ({answers.length})</TabsTrigger>
        </TabsList>

        {/* Summary Tab */}
        <TabsContent value="summary" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-muted/50 p-3">
                    <div className="text-2xl font-bold text-foreground">{totalVotesReceived}</div>
                    <div className="text-xs text-muted-foreground">votes received</div>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <div className="text-2xl font-bold text-foreground">{acceptedAnswers}</div>
                    <div className="text-xs text-muted-foreground">accepted answers</div>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <div className="text-2xl font-bold text-foreground">
                      {questions.reduce((acc, q) => acc + q.viewCount, 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">question views</div>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <div className="text-2xl font-bold text-foreground">
                      {Math.round((acceptedAnswers / Math.max(answers.length, 1)) * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">acceptance rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Tags Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Tags</CardTitle>
              </CardHeader>
              <CardContent>
                {topTags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {topTags.map((tag) => (
                      <TagBadge key={tag} tag={tag} size="md" />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No tags yet. Ask or answer questions to build your profile.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...questions, ...answers]
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 5)
                    .map((item) => {
                      const isQuestion = "title" in item
                      const question = isQuestion ? item : questions.find((q) => q.id === (item as Answer).questionId)

                      return (
                        <div key={item.id} className="flex items-start gap-3 rounded-md border border-border p-3">
                          <div
                            className={cn(
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                              isQuestion ? "bg-primary/10 text-primary" : "bg-success/10 text-success",
                            )}
                          >
                            {isQuestion ? <HelpCircle className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm">
                              <span className="text-muted-foreground">{isQuestion ? "Asked" : "Answered"}</span>{" "}
                              <Link
                                href={`/questions/${isQuestion ? item.id : (item as Answer).questionId}`}
                                className="font-medium text-primary hover:underline"
                              >
                                {isQuestion ? (item as Question).title : question?.title || "Question"}
                              </Link>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Intl.DateTimeFormat("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }).format(new Date(item.createdAt))}
                            </p>
                          </div>
                          <div className="text-right text-sm">
                            <span
                              className={cn(
                                "font-medium",
                                item.voteCount > 0
                                  ? "text-success"
                                  : item.voteCount < 0
                                    ? "text-destructive"
                                    : "text-muted-foreground",
                              )}
                            >
                              {item.voteCount > 0 ? "+" : ""}
                              {item.voteCount}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  {questions.length === 0 && answers.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground">No activity yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Questions Tab */}
        <TabsContent value="questions" className="mt-6">
          {questions.length > 0 ? (
            <div className="space-y-3">
              {questions.map((question) => (
                <Link
                  key={question.id}
                  href={`/questions/${question.id}`}
                  className="flex items-start gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/50"
                >
                  <div className="flex flex-col items-center gap-1 text-center">
                    <span
                      className={cn(
                        "text-lg font-semibold",
                        question.voteCount > 0 ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {question.voteCount}
                    </span>
                    <span className="text-xs text-muted-foreground">votes</span>
                  </div>
                  <div
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-md px-2 py-1 text-center",
                      question.acceptedAnswerId
                        ? "bg-success/10 text-success"
                        : question.answerCount > 0
                          ? "border border-success text-success"
                          : "text-muted-foreground",
                    )}
                  >
                    {question.acceptedAnswerId && <Check className="h-3 w-3" />}
                    <span className="text-lg font-semibold">{question.answerCount}</span>
                    <span className="text-xs">answers</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-primary">{question.title}</h3>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {question.tags.slice(0, 3).map((tag) => (
                        <TagBadge key={tag} tag={tag} interactive={false} />
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-card p-8 text-center">
              <p className="text-muted-foreground">This user hasn't asked any questions yet.</p>
            </div>
          )}
        </TabsContent>

        {/* Answers Tab */}
        <TabsContent value="answers" className="mt-6">
          {answers.length > 0 ? (
            <div className="space-y-3">
              {answers.map((answer) => {
                const question = questions.find((q) => q.id === answer.questionId)
                return (
                  <Link
                    key={answer.id}
                    href={`/questions/${answer.questionId}`}
                    className="flex items-start gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/50"
                  >
                    <div className="flex flex-col items-center gap-1 text-center">
                      <span
                        className={cn(
                          "text-lg font-semibold",
                          answer.voteCount > 0 ? "text-foreground" : "text-muted-foreground",
                        )}
                      >
                        {answer.voteCount}
                      </span>
                      <span className="text-xs text-muted-foreground">votes</span>
                    </div>
                    {answer.isAccepted && (
                      <div className="flex flex-col items-center gap-1 rounded-md bg-success/10 px-2 py-1 text-center text-success">
                        <Check className="h-4 w-4" />
                        <span className="text-xs">accepted</span>
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-muted-foreground">Answered:</p>
                      <h3 className="font-medium text-primary">{question?.title || "Question"}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{answer.body.slice(0, 150)}...</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-card p-8 text-center">
              <p className="text-muted-foreground">This user hasn't answered any questions yet.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
