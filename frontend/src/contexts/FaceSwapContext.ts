import { SwapGenerateLink } from "@/lib/api"
import { createContext } from "react"

export type FaceSwapContextType = {
  faceUrl: string | undefined
  targetUrl: string | undefined
  setFaceUrl: (url: string | undefined) => void
  setTargetUrl: (url: string | undefined) => void
  links: SwapGenerateLink[]
  doSwap: () => void
  swapProcessing: boolean
  seed: number | undefined
  setSeed: (seed: number | undefined) => void
}

export const FaceSwapContext = createContext<FaceSwapContextType | null>(null)
