"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { Award, Briefcase, Camera, FileText, GraduationCap, History, Layers, Lightbulb, List, MapPin, Phone, Star, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CandidateProfileForm() {
    const { user } = useAuth();
    const userName = user?.email?.split('@')[0] || "User";

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>This is how other people will see you on the site.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col items-center gap-4">
                        <Avatar className="h-32 w-32">
                            <AvatarImage src={user?.photoURL || `https://placehold.co/128x128.png`} alt="User avatar" data-ai-hint="person face" />
                            <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="sm">
                            <Camera className="mr-2 h-4 w-4" />
                            Upload Photo
                        </Button>
                    </div>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="full-name">Full Name</Label>
                            <Input id="full-name" defaultValue={userName} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue={user?.email || ""} readOnly />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" type="tel" placeholder="+1 234 567 890" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="location">Location</Label>
                            <Input id="location" placeholder="e.g. San Francisco, CA" />
                        </div>
                    </div>
                </CardContent>
                <CardContent>
                    <div className="grid gap-2">
                        <Label htmlFor="bio">About</Label>
                        <Textarea id="bio" placeholder="Tell us a little bit about yourself" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Resume</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                    <Button>Upload Resume</Button>
                    <p className="text-sm text-muted-foreground">No resume uploaded. (PDF, up to 5MB)</p>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5" /> Skills</CardTitle>
                        <CardDescription>Add skills to match with the right jobs.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Input placeholder="e.g. React, Node.js, Python" />
                        <div className="flex flex-wrap gap-2 mt-4">
                            <Badge variant="secondary">JavaScript</Badge>
                            <Badge variant="secondary">TypeScript</Badge>
                            <Badge variant="secondary">Next.js</Badge>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5" /> Experience Level</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Input placeholder="e.g. Mid-Level (3-5 years)" />
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><GraduationCap className="h-5 w-5"/> Education</CardTitle>
                    <CardDescription>Add your educational background.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-muted-foreground py-4 border border-dashed rounded-md">
                        <p>No education added yet.</p>
                        <Button variant="link">Add Education</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5"/> Work Experience</CardTitle>
                    <CardDescription>Showcase your professional history.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-muted-foreground py-4 border border-dashed rounded-md">
                        <p>No work experience added yet.</p>
                        <Button variant="link">Add Experience</Button>
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Layers className="h-5 w-5"/> Projects</CardTitle>
                     <CardDescription>Highlight your personal or professional projects.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-muted-foreground py-4 border border-dashed rounded-md">
                        <p>No projects added yet.</p>
                        <Button variant="link">Add Project</Button>
                    </div>
                </CardContent>
            </Card>
            
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Award className="h-5 w-5"/> Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-muted-foreground py-4 border border-dashed rounded-md">
                        <p>No certifications added yet.</p>
                        <Button variant="link">Add Certification</Button>
                    </div>
                </CardContent>
            </Card>

             <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><List className="h-5 w-5"/> Job Applications</CardTitle></CardHeader>
                    <CardContent><p className="text-sm text-muted-foreground">You haven't applied to any jobs yet.</p></CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Star className="h-5 w-5"/> Saved Jobs</CardTitle></CardHeader>
                    <CardContent><p className="text-sm text-muted-foreground">You have no saved jobs.</p></CardContent>
                </Card>
                 <Card className="md:col-span-2">
                    <CardHeader><CardTitle className="flex items-center gap-2"><History className="h-5 w-5"/> Interview History</CardTitle></CardHeader>
                    <CardContent><p className="text-sm text-muted-foreground">No interview history.</p></CardContent>
                </Card>
            </div>

            <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
            </div>
        </div>
    );
}
