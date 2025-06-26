"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { ArrowUpRight, Briefcase, User, Loader2, MapPin, BarChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, limit, orderBy } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';

interface Application extends DocumentData {
  id: string;
  jobTitle: string;
  company: string;

  status: string;
  appliedAt?: { toDate: () => Date };
}

interface Job extends DocumentData {
  id: string;
  title: string;
  company: string;
  location: string;
  createdAt: { toDate: () => Date };
  experienceLevel?: string;
}

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [activeApplicationsCount, setActiveApplicationsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!user || !db) return;

    setIsLoading(true);

    const appsQuery = query(
        collection(db, "applications"), 
        where("candidateId", "==", user.uid)
    );

    const unsubscribeApps = onSnapshot(appsQuery, (snapshot) => {
        const allApps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
        
        const sortedApps = [...allApps].sort((a, b) => (b.appliedAt?.toDate()?.getTime() || 0) - (a.appliedAt?.toDate()?.getTime() || 0));
        setApplications(sortedApps);

        const activeApps = allApps.filter(app => app.status === 'Applied' || app.status === 'In Review' || app.status === 'Interviewing').length;
        setActiveApplicationsCount(activeApps);
    });

    const jobsQuery = query(collection(db, "jobs"), where("status", "==", "Open"), orderBy("createdAt", "desc"), limit(3));
    const unsubscribeJobs = onSnapshot(jobsQuery, (snapshot) => {
        const jobsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
        setRecentJobs(jobsData);
        setIsLoading(false);
    });

    return () => {
        unsubscribeApps();
        unsubscribeJobs();
    };
  }, [user]);

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'Offer Extended': return 'default';
      case 'Declined': return 'destructive';
      case 'Interviewing': return 'secondary';
      default: return 'outline';
    }
  }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Open Jobs
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Link href="/candidate/jobs" className="hover:text-primary hover:underline">Explore</Link>
            </div>
            <p className="text-xs text-muted-foreground">
              Find your next role
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Applications
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
                <div className="text-2xl font-bold">{activeApplicationsCount}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Your applications are currently active.
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
                <CardTitle>New Job Postings</CardTitle>
                <CardDescription>
                Recently added jobs you might be interested in.
                </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/candidate/jobs">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
                <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : (
            <Table>
               <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Company</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentJobs.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={2} className="h-24 text-center">No new jobs posted recently.</TableCell>
                    </TableRow>
                ) : (
                recentJobs.map((job) => (
                    <TableRow key={job.id}>
                    <TableCell>
                      <div className="font-medium">{job.title}</div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {job.location || 'N/A'}
                      </div>
                      {job.experienceLevel && (
                          <div className="text-sm text-muted-foreground flex items-center">
                              <BarChart className="h-3 w-3 mr-1" />
                              {job.experienceLevel}
                          </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {job.company}
                    </TableCell>
                  </TableRow>
                )))}
              </TableBody>
            </Table>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
                <CardTitle>Recent Application Status</CardTitle>
                <CardDescription>
                Track the status of your recent job applications.
                </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/candidate/applications">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
                <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : (
            <Table>
               <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={2} className="h-24 text-center">No recent applications.</TableCell>
                    </TableRow>
                ) : (
                applications.slice(0, 3).map((app) => (
                    <TableRow key={app.id}>
                    <TableCell>
                      <div className="font-medium">{app.jobTitle}</div>
                      <div className="text-sm text-muted-foreground">
                        {app.company}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(app.status)}>{app.status}</Badge>
                    </TableCell>
                  </TableRow>
                )))}
              </TableBody>
            </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
