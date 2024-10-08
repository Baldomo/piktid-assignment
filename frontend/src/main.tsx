import { ApiProvider } from "@/components/ApiProvider"
import { AuthenticationProvider } from "@/components/AuthenticationProvider"
import { FaceSwapProvider } from "@/components/FaceSwapProvider"
import { ThemeProvider } from "@/components/ThemeProviders"
import { TooltipProvider } from "@/components/ui/tooltip"
import "@/index.css"
import { AppRouter } from "@/routes"
import { Settings } from "luxon"
import ReactDOM from "react-dom/client"
import { Toaster } from "sonner"

Settings.defaultLocale = "it-IT"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="light">
    <TooltipProvider delayDuration={100} disableHoverableContent>
      <ApiProvider>
        <AuthenticationProvider>
          <FaceSwapProvider>
            <AppRouter />
            <Toaster closeButton richColors />
          </FaceSwapProvider>
        </AuthenticationProvider>
      </ApiProvider>
    </TooltipProvider>
  </ThemeProvider>
)
