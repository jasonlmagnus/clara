"use client";

import { useState } from "react";
import { useClientStore } from "@/lib/client-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Eye,
  Download,
  Calendar,
  DollarSign,
} from "lucide-react";

export default function DealManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const selectedClient = useClientStore((s) => s.selectedClient);

  const deals = [
    {
      id: "DEAL-001",
      company: "TechCorp Solutions",
      value: "$125,000",
      accountLead: "Sarah Johnson",
      competitor: "Competitor A",
      status: "Interview Completed",
      interviewDate: "2024-01-15",
      industry: "Technology",
    },
    {
      id: "DEAL-002",
      company: "GlobalTech Industries",
      value: "$89,500",
      accountLead: "Mike Chen",
      competitor: "Competitor B",
      status: "Analysis In Progress",
      interviewDate: "2024-01-12",
      industry: "Manufacturing",
    },
    {
      id: "DEAL-003",
      company: "InnovateCo",
      value: "$200,000",
      accountLead: "Emily Davis",
      competitor: "Competitor C",
      status: "Report Generated",
      interviewDate: "2024-01-10",
      industry: "Healthcare",
    },
    {
      id: "DEAL-004",
      company: "StartupXYZ",
      value: "$45,000",
      accountLead: "John Smith",
      competitor: "Competitor A",
      status: "Pending Interview",
      interviewDate: null,
      industry: "Technology",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Interview Completed":
        return "bg-blue-100 text-blue-800";
      case "Analysis In Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Report Generated":
        return "bg-green-100 text-green-800";
      case "Pending Interview":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch =
      deal.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.accountLead.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || deal.status === statusFilter;
    const matchesClient = !selectedClient || deal.company === selectedClient;
    return matchesSearch && matchesStatus && matchesClient;
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deal Management</h1>
          <p className="text-muted-foreground">
            Track and manage closed-lost deals and their analysis status
          </p>
        </div>
        <Button>Import from CRM</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deals.length}</div>
            <p className="text-xs text-muted-foreground">This quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$459.5K</div>
            <p className="text-xs text-muted-foreground">Lost opportunities</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Analysis complete</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Awaiting action</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Deal Pipeline</CardTitle>
          <CardDescription>
            View and manage all closed-lost deals in the analysis pipeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending Interview">
                  Pending Interview
                </SelectItem>
                <SelectItem value="Interview Completed">
                  Interview Completed
                </SelectItem>
                <SelectItem value="Analysis In Progress">
                  Analysis In Progress
                </SelectItem>
                <SelectItem value="Report Generated">
                  Report Generated
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Deal ID</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Account Lead</TableHead>
                <TableHead>Competitor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Interview Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeals.map((deal) => (
                <TableRow key={deal.id}>
                  <TableCell className="font-medium">{deal.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{deal.company}</div>
                      <div className="text-sm text-muted-foreground">
                        {deal.industry}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{deal.value}</TableCell>
                  <TableCell>{deal.accountLead}</TableCell>
                  <TableCell>{deal.competitor}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(deal.status)}>
                      {deal.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {deal.interviewDate
                      ? new Date(deal.interviewDate).toLocaleDateString()
                      : "Not scheduled"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
