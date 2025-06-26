"use client";

import { Briefcase, FileText, LayoutDashboard, UserPlus } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";

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
  return (
    <DashboardLayout
      navItems={navItems}
      userName="John Smith"
      userRole="Recruiter"
    >
      {children}
    </DashboardLayout>
  );
}
