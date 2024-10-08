import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useFaceSwap } from "@/hooks/useFaceSwap"
import { cn } from "@/lib/utils"
import { IconHelp, IconSettings } from "@tabler/icons-react"
import { FormEvent } from "react"

type ParameterCardProps = React.ComponentProps<typeof Card>

export function ParameterCard({ className, ...props }: ParameterCardProps) {
  const { doSwap, swapProcessing, faceUrl, targetUrl, setSeed } = useFaceSwap()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const seed = formData.get("seed") as string | null
    setSeed(Number(seed) || undefined)

    doSwap()
  }

  return (
    <Card className={cn("w-[380px]", className)} {...props}>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Parameters</CardTitle>
          <CardDescription>You can tune the process here.</CardDescription>
        </div>
        <div className="ml-auto pb-2">
          <IconSettings className="h-6 w-6" />
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <div className="flex flex-row items-center">
              <Label htmlFor="email">Seed</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="link" size="icon" className="ml-auto">
                    <IconHelp className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <p className="text-sm">
                    The seed in a stable diffusion model is a number that initializes the random noise for generating
                    diverse outputs from the same input. Changing the seed value will produce different variations while
                    using the same model and input settings.
                  </p>
                </PopoverContent>
              </Popover>
            </div>
            <Input type="number" name="seed" placeholder="0" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit" disabled={!faceUrl || !targetUrl || swapProcessing}>
            Generate
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
