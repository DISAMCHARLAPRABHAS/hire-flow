"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";
import { Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
import { toast } from "@/hooks/use-toast";

interface Application extends DocumentData {
  id: string;
  jobTitle: string;
  company: string;
  status: string;
  appliedAt: {
    toDate: () => Date;
  };
}

export default function CandidateApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!user || !db) return;

    setIsLoading(true);
    const q = query(
      collection(db, "applications"),
      where("candidateId", "==", user.uid),
      orderBy("appliedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const appsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
      setApplications(appsData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching applications: ", error);
      toast({ title: "Error", description: "Failed to fetch your applications.", variant: "destructive" });
      setIsLoading(false);
    });

    return () => unsubscribe();
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
        <h1 className="text-lg font-semibold md:text-2xl font-headline">My Applications</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Application History</CardTitle>
          <CardDescription>
            A list of all your submitted job applications.
          </CardDescription>
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
                <TableHead>Job Title</TableHead>
                <TableHead>Applied On</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">You haven't applied to any jobs yet.</TableCell>
                </TableRow>
              ) : (
                applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div className="font-medium">{app.jobTitle}</div>
                      <div className="text-sm text-muted-foreground">
                        {app.company}
                      </div>
                    </TableCell>
                    <TableCell>{app.appliedAt?.toDate().toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={getBadgeVariant(app.status)}>
                        {app.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}
