"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth"
import { auth, firebaseConfigured } from "@/lib/firebase"

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
  const router = useRouter();
  const schema = mode === 'login' ? loginSchema : signupSchema;

  const {
    register,
    handleSubmit,
    setValue,
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

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    if (!firebaseConfigured || !auth) {
        toast({
            title: "Firebase not configured",
            description: "Please set up your Firebase credentials in .env.local",
            variant: "destructive",
        });
        setIsLoading(false);
        return;
    }

    try {
      if (mode === 'signup') {
        const signupData = data as z.infer<typeof signupSchema>;
        const userCredential = await createUserWithEmailAndPassword(auth, signupData.email, signupData.password);
        await updateProfile(userCredential.user, {
            displayName: signupData.role
        });
        toast({
            title: "Account created.",
            description: "You have been successfully signed up.",
        });
        // The redirect is handled by the AuthProvider
      } else {
        const loginData = data as z.infer<typeof loginSchema>;
        await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
        toast({
            title: "Login successful.",
            description: "Redirecting to your dashboard.",
        });
        // The redirect is handled by the AuthProvider
      }
    } catch (error: any) {
        console.error(error);
        let description: React.ReactNode = "An unexpected error occurred. Please try again.";
        
        if (error.code === 'auth/invalid-api-key' || (error.message && error.message.includes('auth/api-key-not-valid'))) {
          description = "Your Firebase API key is not valid. Please ensure it's correctly set in your .env.local file and that you've restarted the development server."
        } else if (error.code === 'auth/configuration-not-found') {
            description = (
                <span>
                    Firebase Authentication is not configured correctly. Please go to your
                    <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline font-bold px-1">Firebase console</a>
                    , navigate to Authentication &gt; Sign-in method, and enable the Email/Password provider.
                </span>
            );
        } else {
          description = error.message;
        }

        toast({
            title: "Authentication failed",
            description: description,
            variant: "destructive",
        })
    } finally {
        setIsLoading(false);
    }
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
            {(errors as any)?.email && (
              <p className="px-1 text-xs text-destructive">
                {(errors as any).email.message}
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
             {(errors as any)?.password && (
              <p className="px-1 text-xs text-destructive">
                {(errors as any).password.message}
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
                {(errors as any)?.role && (
                    <p className="px-1 text-xs text-destructive">
                        {(errors as any).role.message}
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
