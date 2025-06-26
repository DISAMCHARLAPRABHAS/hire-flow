"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';

import { Briefcase, MapPin, Search, Loader2, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface Job extends DocumentData {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  skills: string[];
  recruiterId: string;
  externalApplyLink?: string;
  experienceLevel?: string;
}

export default function CandidateJobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!db) return;
    setIsLoading(true);
    const q = query(collection(db, "jobs"), where("status", "==", "Open"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const jobsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
      setJobs(jobsData);
      setIsLoading(false);
    }, (error) => {
        console.error("Error fetching jobs: ", error);
        toast({ title: "Error", description: "Could not fetch jobs.", variant: "destructive" });
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleApply = async () => {
    if (!user || !selectedJob || !db) {
      toast({ title: "Error", description: "You must be logged in to apply.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "applications"), {
        jobId: selectedJob.id,
        jobTitle: selectedJob.title,
        company: selectedJob.company,
        recruiterId: selectedJob.recruiterId,
        candidateId: user.uid,
        candidateName: user.email?.split('@')[0] || user.email,
        candidateEmail: user.email,
        status: 'Applied',
        appliedAt: serverTimestamp(),
      });
      
      const jobRef = doc(db, "jobs", selectedJob.id);
      await updateDoc(jobRef, {
        applications: increment(1)
      });

      toast({ title: "Success", description: `Applied for ${selectedJob.title}!` });
      setSelectedJob(null);
    } catch (error) {
      console.error("Error applying for job: ", error);
      toast({ title: "Error", description: "Failed to submit application.", variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (job.experienceLevel && job.experienceLevel.toLowerCase().includes(searchTerm.toLowerCase()))
  );


  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Find Your Next Job</h1>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search jobs, skills, experience..." className="pl-8" onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      {isLoading ? (
         <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <Dialog open={!!selectedJob} onOpenChange={(isOpen) => !isOpen && setSelectedJob(null)}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredJobs.length === 0 ? (
                <p className="text-muted-foreground col-span-full text-center">No open jobs found.</p>
            ) : (
                filteredJobs.map((job) => (
                <Card key={job.id} className="cursor-pointer hover:border-primary transition-colors flex flex-col">
                    <CardHeader>
                    <CardTitle className="font-headline">{job.title}</CardTitle>
                    <CardDescription>{job.company}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" /> {job.location || 'N/A'}
                          </div>
                          <div className="flex items-center">
                              <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" /> {job.type || 'Full-time'}
                          </div>
                          {job.experienceLevel && (
                              <div className="flex items-center">
                                  <BarChart className="h-4 w-4 mr-2 flex-shrink-0" /> {job.experienceLevel}
                              </div>
                          )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                          {job.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">{skill}</Badge>
                          ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      {job.externalApplyLink ? (
                        <Button asChild className="w-full">
                          <a href={job.externalApplyLink} target="_blank" rel="noopener noreferrer">
                            Apply Externally
                          </a>
                        </Button>
                      ) : (
                        <Button className="w-full" onClick={() => setSelectedJob(job)}>View & Apply</Button>
                      )}
                    </CardFooter>
                </Card>
                ))
            )}
        </div>
            {selectedJob && (
                <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="font-headline">Apply for {selectedJob.title}</DialogTitle>
                    <DialogDescription>
                    Submit your application for this position at {selectedJob.company}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <p className="text-sm text-muted-foreground">You are applying as <span className="font-semibold text-foreground">{user?.email}</span>.</p>
                    <p className="text-sm">Click submit to confirm your application. A recruiter will contact you if you're a good fit.</p>
                </div>
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setSelectedJob(null)} disabled={isSubmitting}>Cancel</Button>
                    <Button type="submit" onClick={handleApply} disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit Application
                    </Button>
                </DialogFooter>
                </DialogContent>
            )}
        </Dialog>
      )}
    </>
  );
}
