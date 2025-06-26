
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, doc, updateDoc, deleteDoc, orderBy } from "firebase/firestore";
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
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MoreHorizontal, Loader2, Edit, Trash, PowerOff, Power } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import type { DocumentData } from "firebase/firestore";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Job extends DocumentData {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  skills: string[];
  experienceLevel: string;
  externalApplyLink: string;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);


  // Form state
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [externalApplyLink, setExternalApplyLink] = useState("");

  useEffect(() => {
    if (!user || !db) return;
    
    setIsLoading(true);
    const q = query(collection(db, "jobs"), where("recruiterId", "==", user.uid), orderBy("createdAt", "desc"));
    
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
    setExperienceLevel("");
    setExternalApplyLink("");
    setEditingJob(null);
  }

  useEffect(() => {
    if (isDialogOpen && editingJob) {
      setTitle(editingJob.title || '');
      setCompany(editingJob.company || '');
      setLocation(editingJob.location || '');
      setDescription(editingJob.description || '');
      setSkills(editingJob.skills?.join(', ') || '');
      setExperienceLevel(editingJob.experienceLevel || '');
      setExternalApplyLink(editingJob.externalApplyLink || '');
    } else {
      resetForm();
    }
  }, [isDialogOpen, editingJob]);


  const handleJobSubmit = async () => {
    if (!user || !db) {
        toast({ title: "Error", description: "User not authenticated.", variant: "destructive" });
        return;
    }
    if (!title || !company || !description || !skills || !experienceLevel) {
        toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
        return;
    }
    setIsSubmitting(true);

    const jobData = {
      title,
      company,
      location,
      description,
      skills: skills.split(',').map(s => s.trim()),
      experienceLevel,
      externalApplyLink: externalApplyLink.trim(),
      recruiterId: user.uid,
      recruiterName: user.email,
    };

    try {
      if (editingJob) {
        await updateDoc(doc(db, 'jobs', editingJob.id), jobData);
        toast({ title: "Success", description: "Job updated successfully." });
      } else {
        await addDoc(collection(db, "jobs"), {
          ...jobData,
          status: "Open",
          createdAt: serverTimestamp(),
          applications: 0,
        });
        toast({ title: "Success", description: "Job posted successfully." });
      }
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
        console.error("Error submitting job: ", error);
        toast({ title: "Error", description: "Failed to submit job.", variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  }

  const handleDeleteJob = async (jobId: string | undefined) => {
    if (!jobId || !db) return;
    try {
      await deleteDoc(doc(db, "jobs", jobId));
      toast({ title: "Success", description: "Job deleted successfully." });
    } catch (error) {
      console.error("Error deleting job: ", error);
      toast({ title: "Error", description: "Failed to delete job.", variant: "destructive" });
    } finally {
      setJobToDelete(null);
    }
  }
  
  const handleUpdateStatus = async (job: Job, newStatus: Job['status']) => {
      if (!db) return;
      try {
          await updateDoc(doc(db, "jobs", job.id), { status: newStatus });
          toast({ title: "Success", description: `Job status updated to ${newStatus}`});
      } catch (error) {
          console.error("Error updating status: ", error);
          toast({ title: "Error", description: "Failed to update job status", variant: "destructive" });
      }
  }

  const getBadgeVariant = (status: Job['status']): 'default' | 'secondary' | 'destructive' => {
      switch (status) {
        case "Open": return "default";
        case "Closed": return "destructive";
        case "Paused": return "secondary";
        default: return "default";
      }
  }


  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Job Postings</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingJob(null)}>Create New Job</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-headline">{editingJob ? 'Edit Job Posting' : 'Create Job Posting'}</DialogTitle>
              <DialogDescription>
                {editingJob ? 'Update the details below for your job opening.' : 'Fill in the details below to post a new job opening.'}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-6">
              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input id="title" placeholder="e.g. Senior Frontend Developer" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" placeholder="e.g. Innovate Inc." value={company} onChange={(e) => setCompany(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="e.g. Remote" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="experience">Experience Level</Label>
                  <Input id="experience" placeholder="e.g. 0-1 years" value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="externalApplyLink">External Link (Optional)</Label>
                  <Input id="externalApplyLink" placeholder="https://company.com/apply" value={externalApplyLink} onChange={(e) => setExternalApplyLink(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Job responsibilities, requirements, etc." value={description} onChange={(e) => setDescription(e.target.value)} rows={5}/>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="skills">Skills</Label>
                  <Input id="skills" placeholder="React, Node.js, Figma (comma-separated)" value={skills} onChange={(e) => setSkills(e.target.value)} />
                </div>
              </div>
            </ScrollArea>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>Cancel</Button>
              <Button type="button" onClick={handleJobSubmit} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingJob ? 'Save Changes' : 'Post Job'}
              </Button>
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
                    <TableCell><Badge variant={getBadgeVariant(job.status)}>{job.status}</Badge></TableCell>
                    <TableCell>{job.applications || 0}</TableCell>
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
                          <DropdownMenuItem onSelect={() => {setEditingJob(job); setIsDialogOpen(true); }}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => alert('Viewing applicants is not yet implemented.')}>
                            View Applicants
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {job.status === 'Open' ? (
                            <DropdownMenuItem onSelect={() => handleUpdateStatus(job, 'Closed')}>
                               <PowerOff className="mr-2 h-4 w-4" /> Close Job
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onSelect={() => handleUpdateStatus(job, 'Open')}>
                                <Power className="mr-2 h-4 w-4" /> Re-open Job
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onSelect={() => setJobToDelete(job)}>
                            <Trash className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
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
      
      <AlertDialog open={!!jobToDelete} onOpenChange={(open) => !open && setJobToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this job posting
              and all associated application data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => handleDeleteJob(jobToDelete?.id)}
            >
              Yes, delete it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

    