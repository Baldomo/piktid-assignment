import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { HTMLAttributes, PropsWithChildren, ReactNode, forwardRef } from "react"

type ContentLayoutProps = PropsWithChildren<{
  leftActions?: ReactNode
  rightActions?: ReactNode
  footer?: ReactNode
  scrollable?: boolean
  hideHeader?: boolean
}>

export function ContentLayout({
  children,
  leftActions,
  rightActions,
  footer,
  scrollable = true,
  hideHeader = false,
}: ContentLayoutProps) {
  const Body = scrollable ? ScrollArea : "div"

  return (
    <>
      {!hideHeader && <ContentLayout.Header {...{ leftActions, rightActions }} />}
      <Body
        className={cn(
          scrollable
            ? "h-screen overflow-auto border-0 print:block"
            : "h-[calc(100%_-_theme(spacing.drawer-header)_-_1px)] print:block"
        )}
      >
        {children}
      </Body>
      <ContentLayout.Footer>{footer}</ContentLayout.Footer>
    </>
  )
}

ContentLayout.Header = ({ leftActions, rightActions }: { leftActions?: ReactNode; rightActions?: ReactNode }) => (
  <>
    <div className="h-drawer-header bg-background flex items-center px-4 py-2 print:hidden">
      <div>{leftActions}</div>
      <div className="ml-auto">{rightActions}</div>
    </div>
    <Separator />
  </>
)

ContentLayout.Footer = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => (
    <div className={cn(className, "bg-background print:hidden")} {...props} ref={ref}>
      {children}
    </div>
  )
)
