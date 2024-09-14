import { FaceSwapContext, FaceSwapContextType } from "@/contexts/FaceSwapContext"
import { useContext } from "react"

export function useFaceSwap(): FaceSwapContextType {
  const context = useContext(FaceSwapContext)
  if (context === null) {
    throw new Error(`Missing FaceSwapProvider`)
  }

  return context
}
