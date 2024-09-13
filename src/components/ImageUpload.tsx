import RadialProgress from "@/components/RadialProgress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RequestFileOptions, Response } from "@/lib/api"
import { Icon, IconCloudUpload } from "@tabler/icons-react"
import { AxiosProgressEvent, isAxiosError } from "axios"
import React, { useCallback, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"

interface ImageUploadProps<Resp extends Response> {
  title?: string
  icon?: Icon
  doUpload: (file: File, options?: Partial<RequestFileOptions>) => Promise<Resp>
  extractLink: (resp: Resp) => string
  onUploadComplete?: (url: string) => void
  onFail?: (code?: number) => void
}

export function ImageUpload<R extends Response>({
  title = "Drag an image",
  icon: Icon = IconCloudUpload,
  doUpload,
  extractLink,
  onUploadComplete,
  onFail = () => {},
}: ImageUploadProps<R>) {
  const [loading, setLoading] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [fileDataURL, setFileDataURL] = useState<string | null>(null)
  const [uploadedImagePath, setUploadedImagePath] = useState<string | null>(null)

  useEffect(() => {
    const fileReader = new FileReader()
    let isCancel = false
    if (selectedImage) {
      fileReader.onload = e => {
        const result = e.target?.result?.toString()
        if (result && !isCancel) {
          setFileDataURL(result)
        }
      }
      fileReader.readAsDataURL(selectedImage)
    }

    return () => {
      isCancel = true
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort()
      }
    }
  }, [selectedImage])

  const onUploadProgress = (progressEvent: AxiosProgressEvent) => {
    if (progressEvent.total) {
      const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      setProgress(percentage)
    }
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const image = event.target.files[0]
      setSelectedImage(image)
      handleImageUpload(image)
    }
  }

  const removeSelectedImage = () => {
    setLoading(false)
    setUploadedImagePath(null)
    setSelectedImage(null)
  }

  const handleImageUpload = useCallback(
    async (image: File) => {
      if (!image) return
      setLoading(true)

      try {
        const res = await doUpload(image, { onUploadProgress })
        const url = extractLink(res as R)
        setLoading(false)
        setUploadedImagePath(url)
        if (onUploadComplete) {
          onUploadComplete(url)
        }
      } catch (error) {
        if (isAxiosError(error) && error.status) {
          onFail(error.status)
        }
        setLoading(false)
        console.error("Error uploading image:", error)
      }
    },
    [doUpload, extractLink, onFail, onUploadComplete]
  )

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const image = acceptedFiles[0]
        setSelectedImage(image)
        handleImageUpload(image)
      }
    },
    [handleImageUpload]
  )

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <div className="space-y-3 h-full">
      <div {...getRootProps()} className="h-full">
        <label
          htmlFor="dropzone-file"
          className="relative flex flex-col items-center justify-center p-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 w-full visually-hidden-focusable h-full"
        >
          {loading && (
            <div className="text-center max-w-md">
              <RadialProgress progress={progress} />
              <p className="text-sm font-semibold">Uploading Picture</p>
              <p className="text-xs text-gray-400">
                Do not refresh or perform any other action while the picture is being uploaded
              </p>
            </div>
          )}

          {!loading && !uploadedImagePath && (
            <div className="text-center">
              <div className="border p-2 rounded-md max-w-min mx-auto">
                <Icon size="1.6em" />
              </div>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">{title}</span>
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-400">Select a image or drag here to upload directly</p>
            </div>
          )}

          {uploadedImagePath && !loading && fileDataURL && (
            <div className="text-center space-y-2 flex flex-col h-full">
              <img src={fileDataURL} alt="" className="rounded-lg block w-auto h-full object-cover" />

              <Button onClick={removeSelectedImage} type="button" variant="secondary">
                {uploadedImagePath ? "Remove" : "Close"}
              </Button>
            </div>
          )}
        </label>

        <Input
          {...getInputProps()}
          id="dropzone-file"
          accept="image/png, image/jpeg"
          type="file"
          className="hidden"
          disabled={loading || uploadedImagePath !== null}
          onChange={handleImageChange}
        />
      </div>
    </div>
  )
}
