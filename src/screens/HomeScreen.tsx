import { ContentLayout } from "@/components/layouts/ContentLayout"
import { Table, TableBody, TableHeader, TableRow } from "@/components/ui/table"
import { UserDropdown } from "@/components/UserDropdown"

export function HomeScreen() {
  return (
    <>
      <ContentLayout rightActions={<UserDropdown />}>
        <Table className="table-fixed">
          <TableHeader className="sticky inset-0 bg-secondary">
            <TableRow className="shadow-sticky-header-b [&_th]:pt-4 [&_th]:align-top [&_th]:text-primary [&_input]:text-muted-foreground"></TableRow>
          </TableHeader>
          <TableBody></TableBody>
        </Table>
      </ContentLayout>
    </>
  )
}
