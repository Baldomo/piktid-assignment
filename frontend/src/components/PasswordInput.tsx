"use client"
import * as React from "react"

import { cn } from "@/lib/utils"
import { IconEye, IconEyeOff } from "@tabler/icons-react"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false)
  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  return (
    <div className="relative">
      <input
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
        type={showPassword ? "text" : "password"}
      />
      <div className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-400">
        {showPassword ? (
          <IconEyeOff className="h-4 w-4" onClick={togglePasswordVisibility} />
        ) : (
          <IconEye className="h-4 w-4" onClick={togglePasswordVisibility} />
        )}
      </div>
    </div>
  )
})
Input.displayName = "Input"

export { Input as PasswordInput }
