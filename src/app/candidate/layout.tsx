"use client";

import { Briefcase, FileText, LayoutDashboard, User } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Loader2 } from "lucide-react";

const navItems = [
  { href: "/candidate/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/candidate/jobs", icon: Briefcase, label: "Find Jobs" },
  { href: "/candidate/applications", icon: FileText, label: "My Applications" },
  { href: "/candidate/walk-ins", icon: User, label: "Walk-in Drives" },
];

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && user.displayName !== 'candidate') {
      router.push('/recruiter/dashboard');
    }
  }, [user, loading, router]);

  if (loading || !user || user.displayName !== 'candidate') {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <DashboardLayout
      navItems={navItems}
    >
      {children}
    </DashboardLayout>
  );
}
