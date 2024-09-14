import { ContentLayout } from "@/components/layouts/ContentLayout"
import { UserDropdown } from "@/components/UserDropdown"
import { Outlet } from "react-router-dom"

export function Root() {
  return (
    <ContentLayout
      scrollable={false}
      leftActions={<h2 className="text-lg font-semibold">Studio</h2>}
      rightActions={<UserDropdown />}
    >
      <Outlet />
    </ContentLayout>
  )
}
