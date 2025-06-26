"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Briefcase, Calendar, Users, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, limit, orderBy } from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";

interface Application extends DocumentData {
    id: string;
    candidateName: string;
    candidateEmail: string;
    jobTitle: string;
}

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ interviews: 0, applications: 0, openPositions: 0 });
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !db) return;

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const commonQuery = where("recruiterId", "==", user.uid);
    const dateQuery = where("createdAt", ">=", sixMonthsAgo);
    
    // Fetch open positions
    const jobsQuery = query(collection(db, "jobs"), commonQuery, where("status", "==", "Open"));
    const unsubscribeJobs = onSnapshot(jobsQuery, snapshot => {
      setStats(prev => ({ ...prev, openPositions: snapshot.size }));
    });

    // Fetch new applications
    const appsQuery = query(collection(db, "applications"), commonQuery, where("status", "==", "Applied"));
    const unsubscribeApps = onSnapshot(appsQuery, snapshot => {
      setStats(prev => ({ ...prev, applications: snapshot.size }));
    });

    // Fetch recent applications for table
    const recentAppsQuery = query(collection(db, "applications"), commonQuery, orderBy("appliedAt", "desc"), limit(4));
    const unsubscribeRecentApps = onSnapshot(recentAppsQuery, snapshot => {
        const appsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
        setRecentApplications(appsData);
        if(isLoading) setIsLoading(false);
    });

    return () => {
      unsubscribeJobs();
      unsubscribeApps();
      unsubscribeRecentApps();
    };
  }, [user, isLoading]);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Dashboard</h1>
        <div className="flex gap-2">
            <Button>Schedule Interview</Button>
            <Button variant="secondary" asChild><Link href="/recruiter/jobs">Post a New Job</Link></Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Interviews this week
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.interviews}</div>
            <p className="text-xs text-muted-foreground">
              scheduled for this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.applications}</div>
            <p className="text-xs text-muted-foreground">
              awaiting review
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openPositions}</div>
            <p className="text-xs text-muted-foreground">
              active job postings
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>
                New candidates waiting for review.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/recruiter/applications">
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
                        <TableHead>Candidate</TableHead>
                        <TableHead>Role</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                {recentApplications.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={2} className="h-24 text-center">No recent applications.</TableCell>
                    </TableRow>
                ) : (
                    recentApplications.map((app) => (
                    <TableRow key={app.id}>
                    <TableCell>
                        <div className="flex items-center gap-2">
                            <Avatar className="hidden h-9 w-9 sm:flex">
                            <AvatarImage src={`https://placehold.co/40x40.png?text=${app.candidateName.split(' ').map(n=>n[0]).join('')}`} alt="Avatar" data-ai-hint="person portrait"/>
                            <AvatarFallback>{app.candidateName.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1">
                            <p className="text-sm font-medium leading-none">{app.candidateName}</p>
                            <p className="text-sm text-muted-foreground">{app.candidateEmail}</p>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant="outline">{app.jobTitle}</Badge>
                    </TableCell>
                    </TableRow>
                )))}
                </TableBody>
            </Table>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-40 text-muted-foreground">
                <p>No interviews scheduled.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
