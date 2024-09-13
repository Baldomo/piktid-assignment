import { User } from "@/lib/user"
import { createContext } from "react"

export type AuthenticationContextType = {
  currentUser?: User
  signIn: (username: string, password: string) => Promise<User>
  signOut: () => void
}

export const AuthenticationContext = createContext<AuthenticationContextType | null>(null)
