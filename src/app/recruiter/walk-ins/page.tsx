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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Users, Edit, Trash } from "lucide-react";

const walkIns = [
  {
    company: "Innovate Inc.",
    title: "Engineering & Design Walk-in",
    date: "2024-08-20",
    roles: ["Frontend", "Backend", "UX/UI"],
    attendees: 18,
    slots: 25,
  },
  {
    company: "Data Solutions",
    title: "Analytics & Data Science Drive",
    date: "2024-08-22",
    roles: ["Data Analyst", "Data Scientist", "BI Engineer"],
    attendees: 12,
    slots: 15,
  },
];


export default function RecruiterWalkInsPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Virtual Walk-in Drives</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create Walk-in Drive</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-headline">New Walk-in Drive</DialogTitle>
              <DialogDescription>
                Set up a virtual walk-in drive to attract candidates.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="drive-title" className="text-right">Title</Label>
                <Input id="drive-title" placeholder="e.g. Engineering Hiring Event" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="drive-date" className="text-right">Date</Label>
                <Input id="drive-date" type="date" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="slots" className="text-right">No. of Slots</Label>
                <Input id="slots" type="number" placeholder="20" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Create Drive</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {walkIns.map((drive, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline">{drive.title}</CardTitle>
              <CardDescription>{drive.company}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 flex-grow">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                Date: {drive.date}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-2" />
                {drive.attendees} / {drive.slots} attendees
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-sm">Open Roles:</h4>
                <div className="flex flex-wrap gap-2">
                    {drive.roles.map(role => (
                        <Badge key={role} variant="outline">{role}</Badge>
                    ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button>View Attendees</Button>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon"><Edit className="h-4 w-4"/></Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash className="h-4 w-4"/></Button>
                </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
