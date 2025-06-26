"use client";

import { Briefcase, FileText, LayoutDashboard, UserPlus } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Loader2 } from "lucide-react";

const navItems = [
  { href: "/recruiter/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/recruiter/jobs", icon: Briefcase, label: "Job Postings" },
  { href: "/recruiter/applications", icon: FileText, label: "Applications" },
  { href: "/recruiter/walk-ins", icon: UserPlus, label: "Walk-in Drives" },
];

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && user.displayName !== 'recruiter') {
      router.push('/candidate/dashboard');
    }
  }, [user, loading, router]);

  if (loading || !user || user.displayName !== 'recruiter') {
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
