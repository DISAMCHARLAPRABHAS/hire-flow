import Link from "next/link"
import { UserAuthForm } from "@/components/user-auth-form"

export default function SignupPage() {
  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight font-headline">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Choose your role and enter your details to get started.
        </p>
      </div>
      <UserAuthForm mode="signup" />
      <p className="px-8 text-center text-sm text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <Link
          href="/terms"
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </Link>
        .
      </p>
       <p className="px-8 text-center text-sm text-muted-foreground">
        <Link
          href="/login"
          className="underline underline-offset-4 hover:text-primary"
        >
          Already have an account? Login
        </Link>
      </p>
    </>
  )
}
