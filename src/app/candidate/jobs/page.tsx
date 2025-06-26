"use client";

import { useState } from 'react';
import { Briefcase, MapPin, Search, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

const jobs = [
  {
    title: 'Frontend Developer',
    company: 'Innovate Inc.',
    location: 'Remote',
    type: 'Full-time',
    skills: ['React', 'TypeScript', 'TailwindCSS'],
  },
  {
    title: 'Senior Backend Engineer',
    company: 'Data Solutions',
    location: 'New York, NY',
    type: 'Full-time',
    skills: ['Node.js', 'PostgreSQL', 'AWS'],
  },
  {
    title: 'UX/UI Designer',
    company: 'Creative Minds',
    location: 'San Francisco, CA',
    type: 'Contract',
    skills: ['Figma', 'User Research', 'Prototyping'],
  },
  {
    title: 'Product Manager',
    company: 'TechGadgets',
    location: 'Austin, TX',
    type: 'Full-time',
    skills: ['Agile', 'Roadmapping', 'Jira'],
  },
];

export default function CandidateJobsPage() {
  const [selectedJob, setSelectedJob] = useState(jobs[0]);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Find Your Next Job</h1>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search jobs..." className="pl-8" />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {jobs.map((job, index) => (
          <Dialog key={index}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:border-primary transition-colors">
                <CardHeader>
                  <CardTitle className="font-headline">{job.title}</CardTitle>
                  <CardDescription>{job.company}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4 mr-1" /> {job.location}
                    <Briefcase className="h-4 w-4 mr-1 ml-4" /> {job.type}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => setSelectedJob(job)}>Apply Now</Button>
                </CardFooter>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="font-headline">Apply for {selectedJob.title}</DialogTitle>
                <DialogDescription>
                  Submit your resume and a cover letter to apply for this position at {selectedJob.company}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="resume">Resume (PDF)</Label>
                  <Input id="resume" type="file" />
                </div>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="cover-letter">Cover Letter</Label>
                  <Textarea placeholder="Tell us why you're a great fit..." id="cover-letter" />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="submit">Submit Application</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </>
  );
}
