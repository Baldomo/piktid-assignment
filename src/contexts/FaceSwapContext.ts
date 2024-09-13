import { SwapGenerateLink } from "@/lib/api"
import { createContext } from "react"

export type FaceSwapContextType = {
  faceUrl: string | undefined
  targetUrl: string | undefined
  setFaceUrl: (url: string) => void
  setTargetUrl: (url: string) => void
  links: SwapGenerateLink[]
  doSwap: () => void
  swapProcessing: boolean
}

export const FaceSwapContext = createContext<FaceSwapContextType | null>(null)
