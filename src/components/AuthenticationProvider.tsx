import { useApi } from "@/hooks/useApi"
import { ACCESS_TOKEN_STORAGE_KEY } from "@/lib/api"
import { User } from "@/lib/user"
import { ReactNode, useCallback, useEffect, useState } from "react"
import { AuthenticationContext } from "../contexts/AuthenticationContext"

type Session = {
  user: User
}

export function AuthenticationProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<Session>()
  const api = useApi()

  useEffect(() => {
    // restore previous session (if any)
    const storedToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
    if (storedToken != null) {
      // verify if the session is still valid
      api
        .getUser(storedToken)
        .then(response => {
          if (response) {
            console.info("User has a valid session token")
            setSession({ user: response })
          } else {
            console.info("User session token is expired")
            setSession(undefined)
          }
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      console.debug("No authentication token in local storage")
      setLoading(false)
    }
  }, [api])

  const signIn = useCallback(
    async (username: string, password: string) => {
      const user = await api.login(username, password)

      if (!user) {
        console.warn("User authentication failed")
        throw new Error(`Authentication failed`)
      }

      console.info("User sign-in success!")
      setSession({ user })
      return user
    },
    [api]
  )

  const signOut = useCallback(() => {
    console.info("Signing out user")

    api.logout()
  }, [api])

  if (loading) {
    return null
  }

  return (
    <AuthenticationContext.Provider
      value={{
        currentUser: session?.user,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  )
}
