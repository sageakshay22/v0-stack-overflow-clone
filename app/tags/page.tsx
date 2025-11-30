import { MainLayout } from "@/components/layout/main-layout"
import { TagsGrid } from "@/components/tags/tags-grid"
import { getAllTags } from "@/lib/queries"

export default async function TagsPage() {
  const tags = await getAllTags()

  return (
    <MainLayout showRightSidebar={false}>
      <TagsGrid initialTags={tags} />
    </MainLayout>
  )
}
