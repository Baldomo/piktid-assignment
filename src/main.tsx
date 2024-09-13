import { ThemeProvider } from "@/components/ThemeProviders"
import { TooltipProvider } from "@/components/ui/tooltip"
import "@/index.css"
import { AppRouter } from "@/routes"
import { Settings } from "luxon"
import ReactDOM from "react-dom/client"
import { ApiProvider } from "./components/ApiProvider"
import { AuthenticationProvider } from "./components/AuthenticationProvider"

Settings.defaultLocale = "it-IT"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="light">
    <TooltipProvider delayDuration={100} disableHoverableContent>
      <ApiProvider>
        <AuthenticationProvider>
          <AppRouter />
        </AuthenticationProvider>
      </ApiProvider>
    </TooltipProvider>
  </ThemeProvider>
)
