import { ProtectedRoute } from "@/components/ProtectedRoute"
import { ErrorScreen } from "@/screens/ErrorScreen"
import { HomeScreen } from "@/screens/HomeScreen"
import { Page404 } from "@/screens/Page404"
import { Root } from "@/screens/Root"
import { SignInScreen } from "@/screens/SignInScreen"
import { RouteObject, RouterProvider, createBrowserRouter } from "react-router-dom"

export const ROUTE = {
  root: "/",
  signIn: "signin",
} as const

export const routes: RouteObject[] = [
  {
    path: ROUTE.signIn,
    errorElement: <ErrorScreen />,
    element: <SignInScreen />,
  },
  {
    path: ROUTE.root,
    element: (
      <ProtectedRoute>
        <Root />
      </ProtectedRoute>
    ),
    errorElement: <ErrorScreen />,
    children: [
      {
        index: true,
        element: <HomeScreen />,
      },
    ],
  },
  { path: "*", element: <Page404 /> },
]

export const AppRouter = () => {
  const router = createBrowserRouter(routes)
  return <RouterProvider router={router} />
}
