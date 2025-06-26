import Link from "next/link";
import { HireFlowLogo } from "@/components/icons";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container relative grid h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
            <div className="absolute inset-0 bg-primary" />
            <div className="relative z-20 flex items-center text-lg font-medium font-headline">
                <HireFlowLogo className="mr-2 h-6 w-6" />
                HireFlow
            </div>
            <div className="relative z-20 mt-auto">
                <blockquote className="space-y-2">
                    <p className="text-lg">
                        &ldquo;This platform transformed our hiring process. We found the best talent in record time.&rdquo;
                    </p>
                    <footer className="text-sm">Jane Doe, CEO at Innovate Corp</footer>
                </blockquote>
            </div>
        </div>
        <div className="lg:p-8">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                {children}
            </div>
        </div>
    </div>
  );
}
