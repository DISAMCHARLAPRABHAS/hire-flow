"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building, Camera, ClipboardCheck, Factory, Globe, History, ListChecks, Mail, Medal, Phone, User, Users } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function RecruiterProfileForm() {
    const { user } = useAuth();
    const userName = user?.email?.split('@')[0] || "User";

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                    <CardDescription>Manage your personal and company information.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col items-center gap-4">
                        <Avatar className="h-32 w-32">
                             <AvatarImage src={`https://placehold.co/128x128.png`} alt="Company Logo" data-ai-hint="company logo"/>
                             <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="sm">
                            <Camera className="mr-2 h-4 w-4"/>
                            Upload Logo
                        </Button>
                    </div>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="recruiter-name">Your Name</Label>
                            <Input id="recruiter-name" defaultValue={userName} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="designation">Designation</Label>
                            <Input id="designation" placeholder="e.g. HR Manager, Talent Partner" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue={user?.email || ""} readOnly />
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" type="tel" placeholder="+1 234 567 890" />
                        </div>
                    </div>
                </CardContent>
                 <CardContent>
                    <div className="grid gap-2">
                        <Label htmlFor="about">About You/Company</Label>
                        <Textarea id="about" placeholder="Tell us a little bit about your company and your role." />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Building className="h-5 w-5"/> Company Information</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="company-name">Company Name</Label>
                        <Input id="company-name" placeholder="e.g. Innovate Inc."/>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="company-website">Company Website</Label>
                        <Input id="company-website" placeholder="https://example.com"/>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="industry">Industry</Label>
                        <Input id="industry" placeholder="e.g. Information Technology"/>
                    </div>
                </CardContent>
            </Card>
            
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ListChecks className="h-5 w-5"/> Posted Jobs</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <p className="text-sm text-muted-foreground">You have not posted any jobs yet.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><History className="h-5 w-5"/> Drive History</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <p className="text-sm text-muted-foreground">You have not created any walk-in drives.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ClipboardCheck className="h-5 w-5"/> Interviews Conducted</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <p className="text-sm text-muted-foreground">No interviews have been conducted.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5"/> Candidate Tracker</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <p className="text-sm text-muted-foreground">No candidates tracked yet.</p>
                    </CardContent>
                </Card>
            </div>
            
            <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
            </div>
        </div>
    );
}
