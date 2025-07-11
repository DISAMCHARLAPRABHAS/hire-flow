
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, increment, orderBy } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import { cn } from '@/lib/utils';

import { Briefcase, MapPin, Search, Loader2, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
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
  status: string;
  description?: string;
}

export default function CandidateJobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [isApplyingExternally, setIsApplyingExternally] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!db) return;
    setIsLoading(true);
    const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const jobsData = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Job))
        .filter(job => job.status === "Open");
      setJobs(jobsData);
      setIsLoading(false);
    }, (error) => {
        console.error("Error fetching jobs: ", error);
        toast({ 
          title: "Error fetching jobs", 
          description: "Could not fetch job listings. Please check your network connection and try again. If the problem persists, check the browser console for more details.", 
          variant: "destructive",
          duration: 10000,
        });
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !db) return;

    const q = query(collection(db, "applications"), where("candidateId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const ids = new Set<string>();
        snapshot.forEach((doc) => {
            ids.add(doc.data().jobId);
        });
        setAppliedJobIds(ids);
    });

    return () => unsubscribe();
  }, [user]);

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

  const handleExternalApply = async (job: Job) => {
    if (!user || !db || !job.externalApplyLink) {
      toast({ title: "Error", description: "You must be logged in to apply.", variant: "destructive" });
      return;
    }
    
    setIsApplyingExternally(prev => new Set(prev).add(job.id));
    
    try {
      window.open(job.externalApplyLink, '_blank', 'noopener,noreferrer');

      await addDoc(collection(db, "applications"), {
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        recruiterId: job.recruiterId,
        candidateId: user.uid,
        candidateName: user.email?.split('@')[0] || user.email,
        candidateEmail: user.email,
        status: 'Applied',
        appliedAt: serverTimestamp(),
      });
      
      const jobRef = doc(db, "jobs", job.id);
      await updateDoc(jobRef, {
        applications: increment(1)
      });

      toast({ title: "Success", description: `Your application for ${job.title} has been recorded.` });
    } catch (error) {
      console.error("Error applying for external job: ", error);
      toast({ title: "Error", description: "Failed to record application.", variant: "destructive" });
    } finally {
      setIsApplyingExternally(prev => {
        const newSet = new Set(prev);
        newSet.delete(job.id);
        return newSet;
      });
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
       <div className="space-y-6">
        <div className="text-center">
            <h1 className="text-3xl font-bold font-headline tracking-tight sm:text-4xl">Find Your Next Opportunity</h1>
            <p className="mt-2 text-muted-foreground">Browse through thousands of open positions from top companies.</p>
        </div>
        <div className="relative mx-auto w-full max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
              type="search" 
              placeholder="Search by job title, company, skills..." 
              className="w-full rounded-md pl-12 pr-4 py-3 h-12 text-base shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>


      {isLoading ? (
         <div className="flex justify-center items-center h-64 pt-10">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <Dialog open={!!selectedJob} onOpenChange={(isOpen) => !isOpen && setSelectedJob(null)}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-8">
            {filteredJobs.length === 0 ? (
                <div className="col-span-full text-center py-10">
                  <h3 className="text-xl font-semibold">No Jobs Found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? "Try adjusting your search terms." : "There are currently no open positions. Check back later!"}
                  </p>
                </div>
            ) : (
                filteredJobs.map((job) => (
                <Card 
                  key={job.id}
                  className={cn(
                    "flex flex-col transition-colors group",
                    !job.externalApplyLink && !appliedJobIds.has(job.id) && "cursor-pointer hover:border-primary"
                  )}
                  onClick={() => {
                      if (!job.externalApplyLink && !appliedJobIds.has(job.id)) {
                          setSelectedJob(job);
                      }
                  }}
                >
                    <CardHeader>
                      <CardTitle className="font-headline group-hover:text-primary">{job.title}</CardTitle>
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
                          {job.skills.slice(0,3).map((skill) => (
                            <Badge key={skill} variant="secondary">{skill}</Badge>
                          ))}
                          {job.skills.length > 3 && <Badge variant="secondary">...</Badge>}
                      </div>
                    </CardContent>
                    <CardFooter>
                      {appliedJobIds.has(job.id) ? (
                        <Button className="w-full" disabled>Applied</Button>
                      ) : job.externalApplyLink ? (
                        <Button 
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExternalApply(job);
                          }}
                          disabled={isApplyingExternally.has(job.id)}
                        >
                          {isApplyingExternally.has(job.id) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Apply Externally
                        </Button>
                      ) : (
                        <div className="w-full text-center text-sm font-medium text-primary py-2">
                          View & Apply
                        </div>
                      )}
                    </CardFooter>
                </Card>
                ))
            )}
        </div>
            {selectedJob && (
                <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
                  <DialogHeader>
                      <DialogTitle className="font-headline text-2xl">{selectedJob.title}</DialogTitle>
                      <DialogDescription className="text-base">
                          {selectedJob.company}
                      </DialogDescription>
                  </DialogHeader>

                  <div className="flex-grow overflow-y-auto pr-6 space-y-6 py-4">
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" /> {selectedJob.location || 'N/A'}
                          </div>
                          <div className="flex items-center">
                              <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" /> {selectedJob.type || 'Full-time'}
                          </div>
                          {selectedJob.experienceLevel && (
                            <div className="flex items-center">
                                <BarChart className="h-4 w-4 mr-2 flex-shrink-0" /> {selectedJob.experienceLevel}
                            </div>
                          )}
                      </div>

                      <div>
                          <h4 className="font-semibold text-foreground mb-2">Skills Required</h4>
                          <div className="flex flex-wrap gap-2">
                              {selectedJob.skills.map((skill) => (
                                  <Badge key={skill} variant="secondary">{skill}</Badge>
                              ))}
                          </div>
                      </div>

                      <div>
                          <h4 className="font-semibold text-foreground mb-2">Job Description</h4>
                          <div className="text-sm text-muted-foreground whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none">
                              {selectedJob.description || "No description provided."}
                          </div>
                      </div>
                  </div>
                  
                  <DialogFooter className="pt-4 border-t mt-auto">
                      <Button type="button" variant="ghost" onClick={() => setSelectedJob(null)} disabled={isSubmitting}>Cancel</Button>
                      <Button type="submit" onClick={handleApply} disabled={isSubmitting}>
                          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Apply Now
                      </Button>
                  </DialogFooter>
                </DialogContent>
            )}
        </Dialog>
      )}
    </>
  );
}
