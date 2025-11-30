import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Something went wrong</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {params?.error ? (
              <p className="text-sm text-muted-foreground mb-4">Error: {params.error}</p>
            ) : (
              <p className="text-sm text-muted-foreground mb-4">An unspecified error occurred during authentication.</p>
            )}
            <Link href="/auth/login" className="text-primary underline underline-offset-4">
              Try logging in again
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
