import Link from "next/link";
import { ArrowRight, Briefcase, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    The All-In-One Platform to Streamline Your Hiring
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    HireFlow connects top talent with innovative companies. Schedule interviews, host live coding sessions, and manage applications seamlessly.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <Link href="/recruiter/dashboard">
                  <Card className="group hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-lg font-medium font-headline">For Recruiters</CardTitle>
                      <Briefcase className="h-6 w-6 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Find the best candidates, schedule interviews, and build your dream team.
                      </p>
                      <div className="mt-4 flex items-center text-primary font-semibold">
                        Go to Dashboard <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/candidate/dashboard">
                  <Card className="group hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-lg font-medium font-headline">For Candidates</CardTitle>
                      <Users className="h-6 w-6 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Discover exciting job opportunities and showcase your skills.
                      </p>
                      <div className="mt-4 flex items-center text-primary font-semibold">
                        Go to Dashboard <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 HireFlow Inc. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
