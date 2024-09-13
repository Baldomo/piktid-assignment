import { Loading } from "@/components/Loading"
import { useAuth } from "@/hooks/useAuth"
import { ROUTE } from "@/routes"
import { ReactElement, useEffect } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"

export type ProtectedRouteProps = {
  children?: ReactElement | ReactElement[]
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (currentUser === undefined) {
      const authUrl = new URL(ROUTE.signIn, window.origin)
      authUrl.searchParams.set("return_to", location.pathname)
      window.location.replace(authUrl)
    }
  }, [currentUser, location.pathname, navigate])

  if (currentUser === undefined) {
    return (
      <div className="h-screen flex justify-center">
        <Loading />
      </div>
    )
  }

  return children ? <>{children}</> : <Outlet />
}
