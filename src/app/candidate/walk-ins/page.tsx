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

const walkIns: any[] = [];

export default function CandidateWalkInsPage() {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Virtual Walk-in Drives</h1>
      </div>
      {walkIns.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">No walk-in drives scheduled</h3>
            <p className="text-sm text-muted-foreground">Check back later for future events.</p>
          </div>
        </div>
      ) : (
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
                      {drive.roles.map((role: string) => (
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
      )}
    </>
  );
}
