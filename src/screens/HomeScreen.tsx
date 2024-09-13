import { ImageUpload } from "@/components/ImageUpload"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useApi } from "@/hooks/useApi"
import { UploadFaceResponse, UploadTargetResponse } from "@/lib/api"
import { IconCloudDownload, IconPlus } from "@tabler/icons-react"
import { ArcherContainer, ArcherElement } from "react-archer"
import { toast } from "sonner"

enum ArrowTargets {
  TARGET = "target",
  FACE = "face",
  OUTPUT = "output",
  MIDDLE = "middle",
}

function PlusCircle() {
  return (
    <Avatar className="h-6 w-6">
      <AvatarFallback className="text-gray-500 border text-center p-1">
        <IconPlus />
      </AvatarFallback>
    </Avatar>
  )
}

export function HomeScreen() {
  const api = useApi()

  return (
    <ArcherContainer strokeColor="#9ca3af" noCurves>
      <div className="h-full grid gap-6 grid-rows-1 grid-cols-5 justify-items-center items-center">
        <div className="col-span-3 grid p-6 w-full grid-rows-5 grid-cols-5 align-self-center">
          <ArcherElement
            id={ArrowTargets.FACE}
            relations={[
              {
                targetId: ArrowTargets.MIDDLE,
                targetAnchor: "left",
                sourceAnchor: "bottom",
                style: { strokeDasharray: "5,5", endMarker: false },
              },
            ]}
          >
            <div className="flex h-[300px] w-full shrink-0 items-center justify-center rounded-md col-span-2 row-span-2">
              <ImageUpload<UploadFaceResponse>
                title="Upload your selfie here"
                doUpload={(file, options) => api.swapUploadFace(file, options)}
                onFail={code =>
                  toast.error("Image upload failed", {
                    description: code === 400 ? "The image is invalid" : undefined,
                  })
                }
                extractLink={resp => {
                  toast("Face image uploaded")
                  return resp.face_name
                }}
              />
            </div>
          </ArcherElement>
          <ArcherElement
            id={ArrowTargets.TARGET}
            relations={[
              {
                targetId: ArrowTargets.MIDDLE,
                targetAnchor: "right",
                sourceAnchor: "bottom",
                style: { strokeDasharray: "5,5", endMarker: false },
              },
            ]}
          >
            <div className="flex h-[300px] w-full shrink-0 items-center justify-center rounded-md col-span-2 row-span-2">
              <ImageUpload<UploadTargetResponse>
                title="...and a famous person here"
                doUpload={(file, options) => api.swapUploadTarget(file, options)}
                onFail={code =>
                  toast.error("Image upload failed", {
                    description: code === 400 ? "The image is invalid" : undefined,
                  })
                }
                extractLink={resp => {
                  toast("Target image uploaded")
                  return resp.target_name
                }}
              />
            </div>
          </ArcherElement>

          <div className="col-span-4 row-span-1 w-full flex items-center justify-center">
            <ArcherElement
              id={ArrowTargets.MIDDLE}
              relations={[
                {
                  targetId: ArrowTargets.OUTPUT,
                  targetAnchor: "top",
                  sourceAnchor: "bottom",
                  style: { strokeDasharray: "5,5" },
                },
              ]}
            >
              <div>
                <PlusCircle />
              </div>
            </ArcherElement>
          </div>

          <ArcherElement id={ArrowTargets.OUTPUT}>
            <div className="col-span-4 flex h-[300px] w-full shrink-0 items-center justify-center rounded-md row-span-2">
              <div className="relative flex flex-col items-center justify-center p-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 visually-hidden-focusable h-full">
                <div className="text-center">
                  <div className="border p-2 rounded-md max-w-min mx-auto">
                    <IconCloudDownload size="1.6em" />
                  </div>

                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Your picture is gonna be here</span>
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-400">After it's done processing on our servers</p>
                </div>
              </div>
            </div>
          </ArcherElement>
        </div>
        <p className="col-span-2 align-self-center jusitify-self-center">Right panel</p>
      </div>
    </ArcherContainer>
  )
}
