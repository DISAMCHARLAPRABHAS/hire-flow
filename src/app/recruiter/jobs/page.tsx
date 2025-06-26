"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, doc, updateDoc, deleteDoc } from "firebase/firestore";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

interface Job extends DocumentData {
  id: string;
  title: string;
  applications: number;
  status: "Open" | "Paused" | "Closed";
  createdAt: {
    toDate: () => Date;
  };
}

export default function RecruiterJobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [externalApplyLink, setExternalApplyLink] = useState("");

  useEffect(() => {
    if (!user || !db) return;
    
    setIsLoading(true);
    const q = query(collection(db, "jobs"), where("recruiterId", "==", user.uid));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const jobsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Job));
      setJobs(jobsData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching jobs: ", error);
      toast({ title: "Error", description: "Could not fetch jobs.", variant: "destructive" });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const resetForm = () => {
    setTitle("");
    setCompany("");
    setLocation("");
    setDescription("");
    setSkills("");
    setExternalApplyLink("");
  }

  const handleCreateJob = async () => {
    if (!user || !db) {
        toast({ title: "Error", description: "User not authenticated.", variant: "destructive" });
        return;
    }
    if (!title || !company || !description || !skills) {
        toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
        return;
    }

    try {
        await addDoc(collection(db, "jobs"), {
            title,
            company,
            location,
            description,
            skills: skills.split(',').map(s => s.trim()),
            externalApplyLink: externalApplyLink.trim(),
            recruiterId: user.uid,
            recruiterName: user.email,
            status: "Open",
            createdAt: serverTimestamp(),
            applications: 0,
        });
        toast({ title: "Success", description: "Job posted successfully." });
        resetForm();
        setIsDialogOpen(false);
    } catch (error) {
        console.error("Error creating job: ", error);
        toast({ title: "Error", description: "Failed to post job.", variant: "destructive" });
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Job Postings</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create New Job</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="font-headline">Create Job Posting</DialogTitle>
              <DialogDescription>
                Fill in the details below to post a new job opening.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Job Title</Label>
                <Input id="title" placeholder="e.g. Senior Frontend Developer" className="col-span-3" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company" className="text-right">Company</Label>
                <Input id="company" placeholder="e.g. Innovate Inc." className="col-span-3" value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">Location</Label>
                <Input id="location" placeholder="e.g. Remote" className="col-span-3" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="externalApplyLink" className="text-right">External Link (Optional)</Label>
                <Input id="externalApplyLink" placeholder="https://company.com/apply" className="col-span-3" value={externalApplyLink} onChange={(e) => setExternalApplyLink(e.target.value)} />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">Description</Label>
                <Textarea id="description" placeholder="Job responsibilities, requirements, etc." className="col-span-3" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="skills" className="text-right">Skills</Label>
                <Input id="skills" placeholder="React, Node.js, Figma (comma-separated)" className="col-span-3" value={skills} onChange={(e) => setSkills(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
              <Button type="button" onClick={handleCreateJob}>Post Job</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage Your Job Postings</CardTitle>
          <CardDescription>View, edit, or close your active job postings.</CardDescription>
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
                <TableHead>Status</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Created On</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">No jobs posted yet.</TableCell>
                </TableRow>
              ) : (
                jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell><Badge variant={job.status === 'Open' ? 'default' : 'outline'}>{job.status}</Badge></TableCell>
                    <TableCell>{job.applications}</TableCell>
                    <TableCell>{job.createdAt?.toDate().toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>View Applicants</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
