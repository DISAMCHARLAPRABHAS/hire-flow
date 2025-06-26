"use client";

import { Briefcase, FileText, LayoutDashboard, User } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";

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
  return (
    <DashboardLayout
      navItems={navItems}
      userName="Alex Doe"
      userRole="Candidate"
    >
      {children}
    </DashboardLayout>
  );
}
