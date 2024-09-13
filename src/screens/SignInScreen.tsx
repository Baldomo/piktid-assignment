import { PasswordInput } from "@/components/PasswordInput"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/useAuthentication"
import { validateMinLength } from "@/lib/form"
import { ROUTE } from "@/routes"
import { useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useSearchParams } from "react-router-dom"

type FormFields = {
  username: string
  password: string
}

const SIGN_IN_ERROR = "Invalid username or password"
export const MIN_PASSWORD_LENGTH = 8
export const MIN_USERNAME_LENGTH = 4

export function SignInScreen() {
  const navigate = useNavigate()
  const { signIn, signOut } = useAuth()

  const form = useForm<FormFields>({
    defaultValues: {
      username: "",
      password: "",
    },
    reValidateMode: "onSubmit",
  })
  const [searchParams] = useSearchParams()

  const setError = useCallback((message: string) => form.setError("password", { message, type: "value" }), [form])

  // Always sign out the user when redirected to the login screen
  useEffect(() => signOut(), [signOut])

  const onSubmit = async ({ username, password }: FormFields) => {
    try {
      await signIn(username, password)

      if (searchParams.has("return_to")) {
        window.location.replace(searchParams.get("return_to")!)
      } else {
        navigate({
          pathname: ROUTE.root,
        })
      }
    } catch (e) {
      setError(SIGN_IN_ERROR)
    }
  }

  return (
    <>
      <div className="flex h-full w-full items-center">
        <Card className="max-w-lg w-1/2 md:w-1/3 lg:w-1/4 mt-8 mx-auto">
          <CardHeader className="space-x-1">
            <CardTitle className="text-2xl text-center">
              Welcome to <span style={{ color: "#F58B20" }}>PiktID </span>
            </CardTitle>
            <CardDescription className="text-center">Log in with your PiktID account to continue</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="username"
                    rules={validateMinLength(MIN_USERNAME_LENGTH)}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input {...field} autoFocus placeholder="Username" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <PasswordInput {...field} placeholder="Password" type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4">
                    <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                      Sign in
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            {/* <Button variant="outline" type="button" disabled={form.formState.isSubmitting}>
              <IconBrandGoogleFilled className="mr-2 h-4 w-4" />
              Google
            </Button> */}
            {/* <GoogleLogin
              onSuccess={credentialResponse}
              onError={() => {
                console.log("Login Failed")
              }}
              ux_mode="popup"
              useOneTap={true}
            /> */}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
