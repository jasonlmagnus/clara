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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FileText,
  Download,
  CalendarIcon,
  BarChart3,
  Users,
} from "lucide-react";
import { format } from "date-fns";

export default function ReportsView() {
  const [date, setDate] = useState<Date>();

  const reports = [
    {
      id: "RPT-001",
      title: "Q4 2024 Closed-Lost Analysis",
      type: "Quarterly Report",
      generatedDate: "2024-01-15",
      status: "Complete",
      deals: 23,
      insights: 15,
    },
    {
      id: "RPT-002",
      title: "TechCorp Solutions - Individual Analysis",
      type: "Client Report",
      generatedDate: "2024-01-14",
      status: "Complete",
      deals: 1,
      insights: 8,
    },
    {
      id: "RPT-003",
      title: "Competitor A Trend Analysis",
      type: "Competitive Report",
      generatedDate: "2024-01-12",
      status: "Complete",
      deals: 12,
      insights: 6,
    },
    {
      id: "RPT-004",
      title: "Pricing Impact Assessment",
      type: "Custom Report",
      generatedDate: "2024-01-10",
      status: "Complete",
      deals: 34,
      insights: 12,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate and manage analysis reports and insights
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Generate New Report
        </Button>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">Generate Report</TabsTrigger>
          <TabsTrigger value="existing">Existing Reports</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Standard Reports
                </CardTitle>
                <CardDescription>
                  Pre-configured report types for common analysis needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-4"
                  >
                    <div className="text-left">
                      <div className="font-medium">Client Analysis Report</div>
                      <div className="text-sm text-muted-foreground">
                        Individual deal analysis with insights
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-4"
                  >
                    <div className="text-left">
                      <div className="font-medium">Quarterly Trend Report</div>
                      <div className="text-sm text-muted-foreground">
                        Aggregate trends and patterns
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-4"
                  >
                    <div className="text-left">
                      <div className="font-medium">Competitive Analysis</div>
                      <div className="text-sm text-muted-foreground">
                        Competitor comparison and positioning
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-4"
                  >
                    <div className="text-left">
                      <div className="font-medium">Gap Analysis Report</div>
                      <div className="text-sm text-muted-foreground">
                        Product and service improvement areas
                      </div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Custom Report Builder</CardTitle>
                <CardDescription>
                  Create tailored reports with specific parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="report-title">Report Title</Label>
                  <Input id="report-title" placeholder="Enter report title" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">Client Analysis</SelectItem>
                      <SelectItem value="trend">Trend Analysis</SelectItem>
                      <SelectItem value="competitive">
                        Competitive Analysis
                      </SelectItem>
                      <SelectItem value="custom">Custom Analysis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filters">Filters</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select filters" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Deals</SelectItem>
                      <SelectItem value="high-value">
                        High Value Deals
                      </SelectItem>
                      <SelectItem value="competitor-a">
                        Lost to Competitor A
                      </SelectItem>
                      <SelectItem value="pricing">Pricing Related</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full">Generate Custom Report</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="existing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Library</CardTitle>
              <CardDescription>
                Access and manage previously generated reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{report.title}</h4>
                        <Badge variant="outline">{report.type}</Badge>
                        <Badge variant="default">{report.status}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          Generated:{" "}
                          {new Date(report.generatedDate).toLocaleDateString()}
                        </span>
                        <span>{report.deals} deals analyzed</span>
                        <span>{report.insights} insights</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Executive Summary
                </CardTitle>
                <CardDescription>
                  High-level overview for leadership
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  <p>• Key loss factors and trends</p>
                  <p>• Competitive positioning summary</p>
                  <p>• Strategic recommendations</p>
                  <p>• ROI impact analysis</p>
                </div>
                <Button variant="outline" className="w-full">
                  Use Template
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-500" />
                  Detailed Analysis
                </CardTitle>
                <CardDescription>
                  Comprehensive deal-by-deal breakdown
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  <p>• Individual interview summaries</p>
                  <p>• Detailed competitor analysis</p>
                  <p>• Gap identification matrix</p>
                  <p>• Action item recommendations</p>
                </div>
                <Button variant="outline" className="w-full">
                  Use Template
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-500" />
                  Sales Team Brief
                </CardTitle>
                <CardDescription>
                  Actionable insights for sales teams
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  <p>• Common objections and responses</p>
                  <p>• Competitive battle cards</p>
                  <p>• Pricing guidance</p>
                  <p>• Win/loss patterns</p>
                </div>
                <Button variant="outline" className="w-full">
                  Use Template
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
