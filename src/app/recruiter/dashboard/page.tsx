import Link from "next/link";
import { ArrowUpRight, Briefcase, Calendar, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

const applications = [
  { name: 'Olivia Martin', email: 'olivia.martin@email.com', role: 'Frontend Developer', avatar: 'https://placehold.co/40x40.png?text=OM' },
  { name: 'Jackson Lee', email: 'jackson.lee@email.com', role: 'Backend Developer', avatar: 'https://placehold.co/40x40.png?text=JL' },
  { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', role: 'UX Designer', avatar: 'https://placehold.co/40x40.png?text=IN' },
  { name: 'William Kim', email: 'will@email.com', role: 'Product Manager', avatar: 'https://placehold.co/40x40.png?text=WK' },
];

const interviews = [
    { candidate: "Sophia Davis", role: "UX Designer", date: "2024-08-16", time: "11:00 AM"},
    { candidate: "Liam Garcia", role: "Backend Engineer", date: "2024-08-16", time: "2:00 PM"},
]

export default function RecruiterDashboard() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Dashboard</h1>
        <div className="flex gap-2">
            <Button>Schedule Interview</Button>
            <Button variant="secondary">Post a New Job</Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Interviews this week
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{interviews.length}</div>
            <p className="text-xs text-muted-foreground">
              scheduled for this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{applications.length}</div>
            <p className="text-xs text-muted-foreground">
              in the last 24 hours
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              active job postings
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>
                New candidates waiting for review.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/recruiter/applications">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Candidate</TableHead>
                        <TableHead>Role</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                {applications.slice(0, 4).map((app) => (
                <TableRow key={app.email}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <Avatar className="hidden h-9 w-9 sm:flex">
                          <AvatarImage src={app.avatar} alt="Avatar" data-ai-hint="person portrait"/>
                          <AvatarFallback>{app.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1">
                          <p className="text-sm font-medium leading-none">{app.name}</p>
                          <p className="text-sm text-muted-foreground">{app.email}</p>
                        </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{app.role}</Badge>
                  </TableCell>
                </TableRow>
              ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interviews.map((interview, index) => (
                    <TableRow key={index}>
                    <TableCell>
                      <div className="font-medium">{interview.candidate}</div>
                      <div className="text-sm text-muted-foreground">
                        {interview.role}
                      </div>
                    </TableCell>
                    <TableCell>{interview.time}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm">Start Interview</Button>
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
