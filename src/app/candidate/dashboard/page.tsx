import Link from "next/link";
import { ArrowUpRight, Briefcase, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const interviews = [
  {
    company: "Innovate Inc.",
    role: "Frontend Developer",
    date: "2024-08-15",
    time: "10:30 AM",
    type: "Video Call",
  },
  {
    company: "Data Solutions",
    role: "Data Analyst",
    date: "2024-08-18",
    time: "2:00 PM",
    type: "On-site",
  },
];

const applications = [
  {
    role: "Senior Product Manager",
    company: "TechGadgets",
    date: "2024-07-20",
    status: "In Review",
  },
  {
    role: "UX Designer",
    company: "Creative Minds",
    date: "2024-07-18",
    status: "Interviewing",
  },
   {
    role: "Backend Engineer",
    company: "CloudNova",
    date: "2024-07-15",
    status: "Offer Extended",
  },
];


export default function CandidateDashboard() {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Interviews
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{interviews.length}</div>
            <p className="text-xs text-muted-foreground">
              You have {interviews.length} interviews scheduled.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Applications
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
            <p className="text-xs text-muted-foreground">
              Your applications are currently active.
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interviews.map((interview, index) => (
                    <TableRow key={index}>
                    <TableCell>
                      <div className="font-medium">{interview.company}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        {interview.role}
                      </div>
                    </TableCell>
                    <TableCell>
                      {interview.date} at {interview.time}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline">
                        Join Call
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
                <CardTitle>Recent Application Status</CardTitle>
                <CardDescription>
                Track the status of your recent job applications.
                </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/candidate/applications">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
               <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.slice(0, 3).map((app, index) => (
                    <TableRow key={index}>
                    <TableCell>
                      <div className="font-medium">{app.role}</div>
                      <div className="text-sm text-muted-foreground">
                        {app.company}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={app.status === 'Offer Extended' ? 'default' : 'secondary'}>{app.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
