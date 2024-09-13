import { FaceSwapContext } from "@/contexts/FaceSwapContext"
import { useApi } from "@/hooks/useApi"
import { SwapGenerateLink } from "@/lib/api"
import { ReactNode, useState } from "react"

export function FaceSwapProvider({ children }: { children: ReactNode }) {
  const api = useApi()
  const [swapProcessing, setSwapProcessing] = useState(false)
  const [faceUrl, setFaceUrl] = useState<string>()
  const [targetUrl, setTargetUrl] = useState<string>()
  const [links, setLinks] = useState<SwapGenerateLink[]>([])

  const doSwap = () => {
    if (!faceUrl || !targetUrl) {
      return
    }

    setSwapProcessing(true)
    api
      .swapGenerate(faceUrl, targetUrl)
      .then(resp => setLinks(resp.links))
      .finally(() => setSwapProcessing(false))
  }

  return (
    <FaceSwapContext.Provider
      value={{
        faceUrl,
        targetUrl,
        setFaceUrl,
        setTargetUrl,
        links,
        doSwap,
        swapProcessing,
      }}
    >
      {children}
    </FaceSwapContext.Provider>
  )
}
