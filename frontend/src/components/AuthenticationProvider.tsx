import { AuthenticationContext } from "@/contexts/AuthenticationContext"
import { useApi } from "@/hooks/useApi"
import { ACCESS_TOKEN_STORAGE_KEY } from "@/lib/api"
import { User } from "@/lib/user"
import { googleLogout, GoogleOAuthProvider } from "@react-oauth/google"
import { ReactNode, useCallback, useEffect, useState } from "react"
import { decodeToken, isExpired } from "react-jwt"

type Session = {
  user: User
}

type GoogleToken = {
  given_name: string
  family_name: string
  email: string
}

const { GOOGLE_CLIENT_ID, GOOGLE_LOGIN_SECRET_KEY } = import.meta.env

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
        .getUserInfo()
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

  const googleSignIn = useCallback(
    (jwt: string) => {
      if (!GOOGLE_CLIENT_ID || !GOOGLE_LOGIN_SECRET_KEY) {
        return
      }

      if (!isExpired(jwt)) {
        const decoded = decodeToken<GoogleToken>(jwt)
        if (!decoded) {
          return
        }

        const { given_name, family_name, email } = decoded
        api.googleLogin(given_name, family_name, email, GOOGLE_CLIENT_ID, GOOGLE_LOGIN_SECRET_KEY)
      }
    },
    [api]
  )

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
    googleLogout()
    try {
      api.logout()
    } catch {}
    setSession(undefined)
  }, [api])

  if (loading) {
    return null
  }

  return (
    <AuthenticationContext.Provider
      value={{
        currentUser: session?.user,
        googleSignIn,
        googleAuthEnabled: GOOGLE_CLIENT_ID && GOOGLE_LOGIN_SECRET_KEY,
        signIn,
        signOut,
      }}
    >
      {GOOGLE_CLIENT_ID && GOOGLE_LOGIN_SECRET_KEY ? (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>{children}</GoogleOAuthProvider>
      ) : (
        children
      )}
    </AuthenticationContext.Provider>
  )
}
