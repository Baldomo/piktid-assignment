import { ImageUpload } from "@/components/ImageUpload"
import { useApi } from "@/hooks/useApi"
import { UploadFaceResponse, UploadTargetResponse } from "@/lib/api"

export function HomeScreen() {
  const api = useApi()

  return (
    <div className="h-full grid gap-6 grid-rows-1 grid-cols-2 justify-items-center items-center">
      <div className="grid w-full grid-rows-3 grid-cols-3 align-self-center">
        <div className="flex h-[300px] w-full shrink-0 items-center justify-center rounded-md">
          <ImageUpload<UploadFaceResponse>
            doUpload={(file, options) => api.swapUploadFace(file, options)}
            extractLink={resp => resp.face_name}
          />
        </div>
        <div className="flex items-center justify-center">+</div>
        <div className="flex h-[300px] w-full shrink-0 items-center justify-center rounded-md">
          <ImageUpload<UploadTargetResponse>
            doUpload={(file, options) => api.swapUploadTarget(file, options)}
            extractLink={resp => resp.target_name}
          />
        </div>
      </div>
      <p className="align-self-center jusitify-self-center">Right panel</p>
    </div>
  )
}
