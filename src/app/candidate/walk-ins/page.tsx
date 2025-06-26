
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, increment, orderBy } from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";
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
import { Calendar, Users, Loader2, Globe, Building2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
}

export default function CandidateWalkInsPage() {
  const { user } = useAuth();
  const [walkIns, setWalkIns] = useState<WalkInDrive[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [joinedDriveIds, setJoinedDriveIds] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!db) return;
    setIsLoading(true);
    const q = query(
      collection(db, "walk-ins"), 
      where("status", "==", "Open"), 
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const drivesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WalkInDrive));
      setWalkIns(drivesData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching walk-in drives: ", error);
      toast({ title: "Error", description: "Failed to fetch walk-in drives.", variant: "destructive" });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !db) return;

    const q = query(collection(db, "walk-in-attendees"), where("candidateId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const ids = new Set<string>();
        snapshot.forEach((doc) => {
            ids.add(doc.data().driveId);
        });
        setJoinedDriveIds(ids);
    });

    return () => unsubscribe();
  }, [user]);

  const handleJoinDrive = async (drive: WalkInDrive) => {
    if (!user || !db) {
      toast({ title: "Error", description: "You must be logged in to join.", variant: "destructive" });
      return;
    }

    setIsSubmitting(prev => new Set(prev).add(drive.id));
    
    try {
      await addDoc(collection(db, "walk-in-attendees"), {
        driveId: drive.id,
        driveTitle: drive.title,
        recruiterId: drive.recruiterId,
        candidateId: user.uid,
        candidateName: user.email?.split('@')[0] || user.email,
        candidateEmail: user.email,
        joinedAt: serverTimestamp(),
      });
      
      const driveRef = doc(db, "walk-ins", drive.id);
      await updateDoc(driveRef, {
        attendees: increment(1)
      });

      toast({ title: "Success", description: `Successfully joined the "${drive.title}" drive!` });
    } catch (error) {
      console.error("Error joining drive: ", error);
      toast({ title: "Error", description: "Failed to join drive.", variant: "destructive" });
    } finally {
        setIsSubmitting(prev => {
            const newSet = new Set(prev);
            newSet.delete(drive.id);
            return newSet;
        });
    }
  }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Virtual Walk-in Drives</h1>
      </div>
      {isLoading ? (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
      ) : walkIns.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-64">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">No walk-in drives scheduled</h3>
            <p className="text-sm text-muted-foreground">Check back later for future events.</p>
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
                  {drive.attendees || 0} / {drive.slots} slots filled
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
              <CardFooter className="mt-auto">
                  {joinedDriveIds.has(drive.id) ? (
                    <Button className="w-full" disabled>Joined</Button>
                  ) : (drive.attendees || 0) >= drive.slots ? (
                     <Button className="w-full" disabled variant="secondary">Slots Full</Button>
                  ) : (
                    <Button 
                      className="w-full" 
                      onClick={() => handleJoinDrive(drive)}
                      disabled={isSubmitting.has(drive.id)}
                    >
                      {isSubmitting.has(drive.id) && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                      Join Drive
                    </Button>
                  )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
