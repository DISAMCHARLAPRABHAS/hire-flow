
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar, Users, Edit, Trash, Loader2, Globe, Building2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { DocumentData } from "firebase/firestore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

interface WalkInDrive extends DocumentData {
  id: string;
  title: string;
  company: string;
  date: string;
  slots: number;
  roles: string[];
  mode: "Online" | "Offline";
  status: "Open" | "Closed";
  attendees: number;
  createdAt: {
    toDate: () => Date;
  };
}

export default function RecruiterWalkInsPage() {
  const { user } = useAuth();
  const [walkIns, setWalkIns] = useState<WalkInDrive[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editingDrive, setEditingDrive] = useState<WalkInDrive | null>(null);
  const [driveToDelete, setDriveToDelete] = useState<WalkInDrive | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState("");
  const [roles, setRoles] = useState("");
  const [mode, setMode] = useState<"Online" | "Offline">("Online");

  useEffect(() => {
    if (!user || !db) return;
    
    setIsLoading(true);
    const q = query(collection(db, "walk-ins"), where("recruiterId", "==", user.uid));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const drivesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as WalkInDrive));
      
      drivesData.sort((a, b) => (b.createdAt?.toDate()?.getTime() || 0) - (a.createdAt?.toDate()?.getTime() || 0));

      setWalkIns(drivesData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching walk-in drives: ", error);
      toast({ title: "Error", description: "Could not fetch walk-in drives.", variant: "destructive" });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const resetForm = () => {
    setTitle("");
    setCompany("");
    setDate("");
    setSlots("");
    setRoles("");
    setMode("Online");
    setEditingDrive(null);
  }

  useEffect(() => {
    if (isDialogOpen && editingDrive) {
      setTitle(editingDrive.title || '');
      setCompany(editingDrive.company || '');
      setDate(editingDrive.date || '');
      setSlots(editingDrive.slots?.toString() || '');
      setRoles(editingDrive.roles?.join(', ') || '');
      setMode(editingDrive.mode || 'Online');
    } else {
      resetForm();
    }
  }, [isDialogOpen, editingDrive]);

  const handleDriveSubmit = async () => {
    if (!user || !db) {
        toast({ title: "Error", description: "User not authenticated.", variant: "destructive" });
        return;
    }
    if (!title || !company || !date || !slots || !roles || !mode) {
        toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
        return;
    }
    setIsSubmitting(true);

    const driveData = {
      title,
      company,
      date,
      slots: parseInt(slots, 10),
      roles: roles.split(',').map(s => s.trim()),
      mode,
      recruiterId: user.uid,
    };

    try {
      if (editingDrive) {
        await updateDoc(doc(db, 'walk-ins', editingDrive.id), driveData);
        toast({ title: "Success", description: "Drive updated successfully." });
      } else {
        await addDoc(collection(db, "walk-ins"), {
          ...driveData,
          status: "Open",
          attendees: 0,
          createdAt: serverTimestamp(),
        });
        toast({ title: "Success", description: "Drive created successfully." });
      }
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
        console.error("Error submitting drive: ", error);
        toast({ title: "Error", description: "Failed to submit drive.", variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  }

  const handleDeleteDrive = async (driveId: string | undefined) => {
    if (!driveId || !db) return;
    setIsSubmitting(true);
    try {
      // In a real app, you might want to delete associated attendee data as well
      await deleteDoc(doc(db, "walk-ins", driveId));
      toast({ title: "Success", description: "Walk-in drive has been deleted." });
    } catch (error) {
      console.error("Error deleting drive: ", error);
      toast({ title: "Error", description: "Failed to delete drive.", variant: "destructive" });
    } finally {
      setDriveToDelete(null);
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Virtual Walk-in Drives</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingDrive(null)}>Create Walk-in Drive</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle className="font-headline">{editingDrive ? 'Edit Drive' : 'New Walk-in Drive'}</DialogTitle>
              <DialogDescription>
                Set up a virtual walk-in drive to attract candidates.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-6">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="drive-title">Title</Label>
                <Input id="drive-title" placeholder="e.g. Engineering Hiring Event" value={title} onChange={e => setTitle(e.target.value)} />
              </div>
               <div className="grid gap-2">
                <Label htmlFor="drive-company">Company</Label>
                <Input id="drive-company" placeholder="e.g. Innovate Corp" value={company} onChange={e => setCompany(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="drive-date">Date</Label>
                <Input id="drive-date" type="date" value={date} onChange={e => setDate(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="slots">Number of Slots</Label>
                <Input id="slots" type="number" placeholder="20" value={slots} onChange={e => setSlots(e.target.value)} />
              </div>
               <div className="grid gap-2">
                <Label htmlFor="roles">Open Roles (comma-separated)</Label>
                <Textarea id="roles" placeholder="e.g. Frontend Developer, UI/UX Designer" value={roles} onChange={e => setRoles(e.target.value)} />
              </div>
               <div className="grid gap-2">
                <Label>Mode</Label>
                <RadioGroup value={mode} onValueChange={(v: "Online" | "Offline") => setMode(v)} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Online" id="mode-online" />
                    <Label htmlFor="mode-online" className="font-normal">Online</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Offline" id="mode-offline" />
                    <Label htmlFor="mode-offline" className="font-normal">Offline</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            </ScrollArea>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" onClick={handleDriveSubmit} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                {editingDrive ? 'Save Changes' : 'Create Drive'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : walkIns.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-64">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">No walk-in drives created</h3>
            <p className="text-sm text-muted-foreground">Click "Create Walk-in Drive" to get started.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {walkIns.map((drive) => (
            <Card key={drive.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline">{drive.title}</CardTitle>
                <CardDescription>{drive.company}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 flex-grow">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Date: {new Date(drive.date).toLocaleDateString()}
                </div>
                 <div className="flex items-center text-sm text-muted-foreground">
                   {drive.mode === 'Online' ? <Globe className="h-4 w-4 mr-2" /> : <Building2 className="h-4 w-4 mr-2" />}
                   Mode: {drive.mode}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-2" />
                  {drive.attendees || 0} / {drive.slots} attendees
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Open Roles:</h4>
                  <div className="flex flex-wrap gap-2">
                      {drive.roles.map((role: string) => (
                          <Badge key={role} variant="outline">{role}</Badge>
                      ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between mt-auto">
                  <Button variant="outline">View Attendees</Button>
                  <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => { setEditingDrive(drive); setIsDialogOpen(true); }}>
                        <Edit className="h-4 w-4"/>
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setDriveToDelete(drive)}>
                        <Trash className="h-4 w-4"/>
                      </Button>
                  </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!driveToDelete} onOpenChange={(open) => !open && setDriveToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the walk-in drive. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => handleDeleteDrive(driveToDelete?.id)}
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Yes, delete it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
