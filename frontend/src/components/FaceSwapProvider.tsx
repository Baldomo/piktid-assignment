import { FaceSwapContext } from "@/contexts/FaceSwapContext"
import { useApi } from "@/hooks/useApi"
import { useInterval } from "@/hooks/useInterval"
import { SwapGenerateLink } from "@/lib/api"
import { ReactNode, useCallback, useState } from "react"
import { toast } from "sonner"

export function FaceSwapProvider({ children }: { children: ReactNode }) {
  const api = useApi()
  const [jobId, setJobId] = useState<string>()
  const [swapProcessing, setSwapProcessing] = useState(false)
  const [faceUrl, setFaceUrl] = useState<string>()
  const [targetUrl, setTargetUrl] = useState<string>()
  const [links, setLinks] = useState<SwapGenerateLink[]>([])

  useInterval(
    useCallback(() => {
      if (!jobId) {
        console.log("returning")
        return
      }
      api
        .getJob(jobId)
        .then(resp => {
          console.log("Poll", resp)
          if (resp.body.status === "done") {
            setSwapProcessing(false)
            setLinks(resp.body.result.links)
          } else if (resp.body.status === "failed") {
            setSwapProcessing(false)
            toast.error("Image generation failed", { description: "Job failed" })
          }
        })
        .catch(() => {
          toast.error("Image generation failed", { description: "API is unreachable" })
        })
    }, [api, jobId]),
    swapProcessing ? 1000 : null
  )

  const doSwap = () => {
    if (!faceUrl || !targetUrl) {
      return
    }

    api
      .swapGenerate(faceUrl, targetUrl)
      .then(resp => {
        console.log("Job resp", resp)
        setJobId(resp.body.job_id)
        setSwapProcessing(true)
      })
      .catch(() => {
        toast.error("Image generation failed", { description: "Failed to create job" })
      })
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
