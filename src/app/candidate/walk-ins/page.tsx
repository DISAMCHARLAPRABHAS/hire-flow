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
import { Calendar, Users } from "lucide-react";

const walkIns = [
  {
    company: "Innovate Inc.",
    title: "Engineering & Design Walk-in",
    date: "2024-08-20",
    roles: ["Frontend", "Backend", "UX/UI"],
    slots: 25,
  },
  {
    company: "Data Solutions",
    title: "Analytics & Data Science Drive",
    date: "2024-08-22",
    roles: ["Data Analyst", "Data Scientist", "BI Engineer"],
    slots: 15,
  },
  {
    company: "Creative Minds",
    title: "Marketing & Sales Open House",
    date: "2024-08-25",
    roles: ["Marketing Manager", "Sales Rep"],
    slots: 30,
  },
];

export default function CandidateWalkInsPage() {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Virtual Walk-in Drives</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {walkIns.map((drive, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="font-headline">{drive.title}</CardTitle>
              <CardDescription>{drive.company}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                Date: {drive.date}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-2" />
                {drive.slots} slots available
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
            <CardFooter>
                <Button className="w-full">Join Drive</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
