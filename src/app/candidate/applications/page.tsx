import { Badge } from "@/components/ui/badge";
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
  {
    role: 'Frontend Developer',
    company: 'Innovate Inc.',
    date: "2024-07-12",
    status: "Applied",
  },
  {
    role: 'Data Analyst',
    company: 'Data Solutions',
    date: "2024-07-10",
    status: "Declined",
  },
];

export default function CandidateApplicationsPage() {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">My Applications</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Application History</CardTitle>
          <CardDescription>
            A list of all your submitted job applications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Applied On</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="font-medium">{app.role}</div>
                    <div className="text-sm text-muted-foreground">
                      {app.company}
                    </div>
                  </TableCell>
                  <TableCell>{app.date}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={
                      app.status === 'Offer Extended' ? 'default' :
                      app.status === 'Declined' ? 'destructive' : 'secondary'
                    }>
                      {app.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
