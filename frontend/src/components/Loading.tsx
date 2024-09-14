import { Spinner } from "@/components/Spinner"

export function Loading() {
  return (
    <div className="flex flex-col justify-center items-center space-y-4">
      <div className="max-w-[10vw]">
        <Spinner />
      </div>
      <span>Loading...</span>
    </div>
  )
}
