import { ErrorScreen } from "@/screens/ErrorScreen"

export function Page404() {
  return (
    <ErrorScreen
      code={404}
      message="Check the entered URL. If the problem persists, contact support.Check the entered URL. If the problem persists, contact support.Check the entered URL. If the problem persists, contact support."
    />
  )
}
