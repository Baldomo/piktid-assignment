import { ApiContext } from "@/contexts/ApiContext"
import { useContext } from "react"

export function useApi() {
  const api = useContext(ApiContext)
  if (api === null) {
    throw new Error(`Missing ApiContextProvider`)
  }

  return api
}
