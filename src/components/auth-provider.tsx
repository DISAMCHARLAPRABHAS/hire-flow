"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, firebaseConfigured } from "@/lib/firebase";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const protectedRoutes = ["/candidate", "/recruiter"];
const authRoutes = ["/login", "/signup"];

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading || !firebaseConfigured) return;

    const pathIsProtected = protectedRoutes.some((route) => pathname.startsWith(route));
    const pathIsAuth = authRoutes.includes(pathname);
    
    if (!user && pathIsProtected) {
      router.push("/login");
    }

    if (user && pathIsAuth) {
      const userRole = user.displayName || 'candidate';
      router.push(`/${userRole}/dashboard`);
    }

  }, [user, loading, pathname, router]);

  if (!firebaseConfigured) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background p-4">
            <Alert variant="destructive" className="max-w-2xl">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Firebase Not Configured</AlertTitle>
                <AlertDescription>
                    <p className="mb-2">
                        Your Firebase environment variables are not set. Please create a{' '}
                        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">.env.local</code>
                        {' '}file in the root of your project and add your Firebase project credentials.
                    </p>
                    <p>
                        You can copy the format from{' '}
                        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">.env.local.example</code>.
                        After creating the file, you will need to restart the development server.
                    </p>
                </AlertDescription>
            </Alert>
        </div>
    );
  }

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.includes(pathname);
  
  if (loading && (isProtectedRoute || isAuthRoute)) {
    return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }


  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
