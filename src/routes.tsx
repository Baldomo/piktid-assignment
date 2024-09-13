import { ProtectedRoute } from "@/components/ProtectedRoute"
import { ErrorScreen } from "@/screens/ErrorScreen"
import { HomeScreen } from "@/screens/HomeScreen"
import { Page404 } from "@/screens/Page404"
import { SignInScreen } from "@/screens/SignInScreen"
import { Outlet, RouteObject, RouterProvider, createBrowserRouter } from "react-router-dom"

export const ROUTE = {
  root: "/",
  signIn: "signin",
} as const

export const routes: RouteObject[] = [
  {
    path: ROUTE.root,
    element: <Outlet />,
    errorElement: <ErrorScreen />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <HomeScreen />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTE.signIn,
        element: <SignInScreen />,
      },
    ],
  },

  { path: "*", element: <Page404 /> },
]

export const AppRouter = () => {
  const router = createBrowserRouter(routes)
  return <RouterProvider router={router} />
}
