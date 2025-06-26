import { File, MoreHorizontal, ListFilter } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const applicants = {
    "Frontend Developer": [
        { name: "Alex Johnson", email: "alex.j@example.com", status: "New", applied: "2024-07-28" },
        { name: "Maria Garcia", email: "maria.g@example.com", status: "In Review", applied: "2024-07-27" },
        { name: "Sam Wilson", email: "sam.w@example.com", status: "Interviewing", applied: "2024-07-25" },
    ],
    "Senior Backend Engineer": [
        { name: "David Chen", email: "david.c@example.com", status: "New", applied: "2024-07-29" },
        { name: "Laura Kim", email: "laura.k@example.com", status: "In Review", applied: "2024-07-26" },
    ]
}

export default function RecruiterApplicationsPage() {
  return (
    <Tabs defaultValue="Frontend Developer">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="Frontend Developer">Frontend Developer</TabsTrigger>
          <TabsTrigger value="Senior Backend Engineer">Senior Backend Engineer</TabsTrigger>
          <TabsTrigger value="UX/UI Designer">UX/UI Designer</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>New</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>In Review</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Interviewing</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Applications</CardTitle>
          <CardDescription>
            Manage and review applications for your job postings.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {Object.entries(applicants).map(([jobTitle, applicantList]) => (
                <TabsContent value={jobTitle} key={jobTitle}>
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Candidate</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="hidden md:table-cell">
                            Applied On
                            </TableHead>
                            <TableHead>
                            <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                            {applicantList.map((applicant, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={`https://placehold.co/40x40.png?text=${applicant.name.split(' ').map(n=>n[0]).join('')}`} alt="Avatar" data-ai-hint="person face"/>
                                                <AvatarFallback>{applicant.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                {applicant.name}
                                                <p className="text-sm text-muted-foreground">{applicant.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                    <Badge variant="outline">{applicant.status}</Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        {applicant.applied}
                                    </TableCell>
                                    <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                        <Button
                                            aria-haspopup="true"
                                            size="icon"
                                            variant="ghost"
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Toggle menu</span>
                                        </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem>View Application</DropdownMenuItem>
                                        <DropdownMenuItem>Schedule Interview</DropdownMenuItem>
                                        <DropdownMenuItem>Archive</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabsContent>
            ))}
        </CardContent>
      </Card>
    </Tabs>
  )
}
