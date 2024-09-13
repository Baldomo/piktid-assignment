import PiktidApiClient from "@/lib/api"
import { createContext } from "react"

export const ApiContext = createContext<PiktidApiClient | null>(null)
