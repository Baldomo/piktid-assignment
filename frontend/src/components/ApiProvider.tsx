import { ApiContext } from "@/contexts/ApiContext"
import PiktidApiClient from "@/lib/api"
import { ReactNode, useMemo } from "react"

type ApiProviderProps = {
  children: ReactNode
  onError?: () => void
  onErrorUnauthorized?: () => void
}

export function ApiProvider({ children, onError = () => {}, onErrorUnauthorized = () => {} }: ApiProviderProps) {
  const api = useMemo(() => {
    return new PiktidApiClient(onError, onErrorUnauthorized)
  }, [onError, onErrorUnauthorized])

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>
}
