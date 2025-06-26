"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
    mode: "login" | "signup";
}

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required."}),
})

const signupSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
  role: z.enum(["recruiter", "candidate"], { required_error: "You must select a role." }),
})

type FormData = z.infer<typeof loginSchema> | z.infer<typeof signupSchema>;

export function UserAuthForm({ className, mode, ...props }: UserAuthFormProps) {
  const searchParams = useSearchParams()
  const schema = mode === 'login' ? loginSchema : signupSchema;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      ...(mode === 'signup' && { role: "candidate" }),
    },
  })
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const role = watch("role" as "role");

  async function onSubmit(data: FormData) {
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Success!",
        description: `You have successfully ${mode === 'login' ? 'logged in' : 'signed up'}. Redirecting...`,
      })
      // Here you would typically handle the auth logic and redirect
    }, 3000)
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...register("email")}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              autoComplete="current-password"
              disabled={isLoading}
              {...register("password")}
            />
             {errors?.password && (
              <p className="px-1 text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {mode === 'signup' && (
            <div className="grid gap-2">
                <Label>I am a...</Label>
                <RadioGroup 
                    defaultValue="candidate" 
                    className="flex space-x-4"
                    onValueChange={(value) => setValue("role", value as "recruiter" | "candidate")}
                    disabled={isLoading}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="candidate" id="r-candidate" />
                        <Label htmlFor="r-candidate">Candidate</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="recruiter" id="r-recruiter" />
                        <Label htmlFor="r-recruiter">Recruiter</Label>
                    </div>
                </RadioGroup>
                {errors?.role && (
                    <p className="px-1 text-xs text-destructive">
                        {errors.role.message}
                    </p>
                )}
            </div>
          )}

          <button className={cn(buttonVariants())} disabled={isLoading}>
            {isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </div>
      </form>
    </div>
  )
}
