import { Separator } from "@/components/ui/separator"

export function ErrorScreen({ code = 500, message }: { code?: number; message?: string }) {
  return (
    <div className="h-screen text-center flex flex-col items-center justify-center space-y-4">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-medium align-top py-2">{code}</h1>
        <Separator orientation="vertical" />
        <h2 className="text-sm font-normal m-0">{message || "Something went wrong :("}</h2>
      </div>
    </div>
  )
}
