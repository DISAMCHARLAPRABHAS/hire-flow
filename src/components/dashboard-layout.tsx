"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  CircleUser,
  LogOut,
  Menu,
  Settings,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth, firebaseConfigured } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HireFlowLogo } from "./icons";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { toast } from "@/hooks/use-toast";

type NavItem = {
  href: string;
  icon: React.ElementType;
  label: string;
};

type DashboardLayoutProps = {
  children: React.ReactNode;
  navItems: NavItem[];
};

export function DashboardLayout({
  children,
  navItems,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = async () => {
    if (!firebaseConfigured || !auth) {
        toast({
            title: "Logout failed",
            description: "Firebase is not configured.",
            variant: "destructive",
        });
        return;
    }
    try {
      await signOut(auth);
      router.push("/login");
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Error signing out: ", error);
      toast({
        title: "Logout failed",
        description: "An error occurred while logging out.",
        variant: "destructive",
      });
    }
  };

  const navLinks = (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            pathname === item.href && "bg-muted text-primary"
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  );

  const userName = user?.email?.split('@')[0] || "User";
  const userRole = user?.displayName || "candidate";

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-card md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold font-headline">
              <HireFlowLogo className="h-6 w-6" />
              <span className="">HireFlow</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1">
            {navLinks}
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              {navLinks}
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            {/* Can add search bar here if needed */}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="flex items-center gap-2 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.photoURL || `https://placehold.co/40x40.png`} alt={userName} data-ai-hint="profile avatar" />
                  <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                    <span className="font-medium">{userName}</span>
                    <span className="text-xs text-muted-foreground capitalize">{userRole}</span>
                </div>
                <ChevronDown className="hidden md:block h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem><Settings className="mr-2 h-4 w-4"/>Settings</DropdownMenuItem>
               <DropdownMenuItem onSelect={() => router.push(`/${userRole}/profile`)} className="cursor-pointer">
                <CircleUser className="mr-2 h-4 w-4"/>Profile
               </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onSelect={handleLogout}><LogOut className="mr-2 h-4 w-4"/>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
