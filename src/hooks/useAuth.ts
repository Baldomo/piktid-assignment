import { AuthenticationContext, AuthenticationContextType } from "@/contexts/AuthenticationContext"
import { useContext } from "react"

export function useAuth(): AuthenticationContextType {
  const context = useContext(AuthenticationContext)
  if (context === null) {
    throw new Error(`Missing AuthenticationContextProvider`)
  }

  return context
}
