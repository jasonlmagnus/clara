"use client";

import { useState } from "react";
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
    return matchesSearch && matchesStatus;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deal Management</CardTitle>
        <CardDescription>Coming soon...</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is where the deal management content will go.</p>
      </CardContent>
    </Card>
  );
}
