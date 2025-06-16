"use client";

import { useState, useEffect } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  Download,
  CalendarIcon,
  BarChart3,
  Users,
  Loader2,
  X,
} from "lucide-react";
import { format } from "date-fns";

interface Report {
  report_id: string;
  title: string;
  type: string;
  status: string;
  generated: string;
  dealsAnalyzed: number;
  insights: number;
}

interface DetailedReport {
  report_id: string;
  project_name: string;
  description: string;
  interview_structure: Array<{
    section_title: string;
    duration?: string;
    points?: string[];
    questions?: Array<{
      number: number;
      text: string;
      answer?: string;
      evidence?: string;
      sub_points?: string[];
      note?: string;
    }>;
  }>;
  original_filename: string;
  created_at: string;
}

export default function ReportsView() {
  const [date, setDate] = useState<Date>();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<DetailedReport | null>(
    null
  );
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [isLoadingTranscript, setIsLoadingTranscript] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/reports");
        if (!response.ok) {
          throw new Error("Failed to fetch reports");
        }
        const data = await response.json();
        setReports(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError(err instanceof Error ? err.message : "Failed to load reports");
        setReports([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  const fetchReportDetails = async (reportId: string) => {
    try {
      setIsLoadingReport(true);
      const response = await fetch(`/api/reports/${reportId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch report details");
      }
      const data = await response.json();
      setSelectedReport(data);
    } catch (err) {
      console.error("Error fetching report details:", err);
    } finally {
      setIsLoadingReport(false);
    }
  };

  const fetchTranscript = async (reportId: string) => {
    try {
      setIsLoadingTranscript(true);
      const response = await fetch(`/api/reports/${reportId}/transcript`);
      if (!response.ok) {
        throw new Error("Failed to fetch transcript");
      }
      const data = await response.json();
      setTranscript(data.transcript);
    } catch (err) {
      console.error("Error fetching transcript:", err);
      setTranscript("Transcript not available");
    } finally {
      setIsLoadingTranscript(false);
    }
  };

  const downloadReport = (report: DetailedReport) => {
    const dataStr = JSON.stringify(report, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${report.original_filename.replace(
      /\.[^/.]+$/,
      ""
    )}_analysis.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

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
          <TabsTrigger value="existing">Reports</TabsTrigger>
          <TabsTrigger value="generate">Create Report</TabsTrigger>
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
                {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading reports...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-red-600">Error: {error}</p>
                  </div>
                ) : reports.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No reports found. Upload an audio file to generate your
                      first report!
                    </p>
                  </div>
                ) : (
                  reports.map((report) => (
                    <div
                      key={report.report_id}
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
                            {new Date(report.generated).toLocaleDateString()}
                          </span>
                          <span>{report.dealsAnalyzed} deals analyzed</span>
                          <span>{report.insights} insights</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                fetchReportDetails(report.report_id);
                                setTranscript(null); // Reset transcript when opening new report
                              }}
                            >
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh]">
                            <DialogHeader>
                              <DialogTitle>
                                {selectedReport?.project_name ||
                                  "Report Details"}
                              </DialogTitle>
                              <DialogDescription>
                                {selectedReport?.original_filename} • Generated{" "}
                                {selectedReport &&
                                  new Date(
                                    selectedReport.created_at
                                  ).toLocaleDateString()}
                              </DialogDescription>
                            </DialogHeader>

                            {isLoadingReport ? (
                              <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin" />
                                <span className="ml-2">Loading report...</span>
                              </div>
                            ) : selectedReport ? (
                              <div className="space-y-4">
                                <div className="flex justify-end">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      downloadReport(selectedReport)
                                    }
                                    className="flex items-center gap-2"
                                  >
                                    <Download className="h-4 w-4" />
                                    Download JSON
                                  </Button>
                                </div>

                                <Tabs
                                  defaultValue="analysis"
                                  className="w-full"
                                >
                                  <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="analysis">
                                      Analysis
                                    </TabsTrigger>
                                    <TabsTrigger
                                      value="transcript"
                                      onClick={() => {
                                        if (selectedReport && !transcript) {
                                          fetchTranscript(
                                            selectedReport.report_id
                                          );
                                        }
                                      }}
                                    >
                                      Transcript
                                    </TabsTrigger>
                                  </TabsList>

                                  <TabsContent value="analysis">
                                    <ScrollArea className="h-[60vh] pr-4">
                                      <div className="space-y-6">
                                        <div>
                                          <h3 className="text-lg font-semibold mb-2">
                                            Description
                                          </h3>
                                          <p className="text-sm text-muted-foreground leading-relaxed">
                                            {selectedReport.description}
                                          </p>
                                        </div>

                                        {selectedReport.interview_structure.map(
                                          (section, sectionIndex) => (
                                            <div
                                              key={sectionIndex}
                                              className="border rounded-lg p-4"
                                            >
                                              <div className="flex items-center justify-between mb-3">
                                                <h4 className="text-md font-semibold">
                                                  {section.section_title}
                                                </h4>
                                                {section.duration && (
                                                  <Badge variant="outline">
                                                    {section.duration}
                                                  </Badge>
                                                )}
                                              </div>

                                              {section.points && (
                                                <div className="mb-4">
                                                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                                    {section.points.map(
                                                      (point, pointIndex) => (
                                                        <li key={pointIndex}>
                                                          {point}
                                                        </li>
                                                      )
                                                    )}
                                                  </ul>
                                                </div>
                                              )}

                                              {section.questions && (
                                                <div className="space-y-4">
                                                  {section.questions.map(
                                                    (
                                                      question,
                                                      questionIndex
                                                    ) => (
                                                      <div
                                                        key={questionIndex}
                                                        className="border-l-2 border-blue-200 pl-4"
                                                      >
                                                        <div className="flex items-start gap-2 mb-2">
                                                          <Badge
                                                            variant="secondary"
                                                            className="text-xs"
                                                          >
                                                            Q{question.number}
                                                          </Badge>
                                                          <p className="text-sm font-medium flex-1">
                                                            {question.text}
                                                          </p>
                                                        </div>

                                                        {question.sub_points && (
                                                          <ul className="list-disc list-inside ml-6 mb-2 text-xs text-muted-foreground">
                                                            {question.sub_points.map(
                                                              (
                                                                subPoint,
                                                                subIndex
                                                              ) => (
                                                                <li
                                                                  key={subIndex}
                                                                >
                                                                  {subPoint}
                                                                </li>
                                                              )
                                                            )}
                                                          </ul>
                                                        )}

                                                        {question.note && (
                                                          <p className="text-xs text-blue-600 mb-2 ml-6">
                                                            Note:{" "}
                                                            {question.note}
                                                          </p>
                                                        )}

                                                        {question.answer && (
                                                          <div className="ml-6 mt-2">
                                                            <p className="text-xs font-medium text-green-700 mb-1">
                                                              Answer:
                                                            </p>
                                                            <p className="text-sm text-gray-700 leading-relaxed">
                                                              {question.answer}
                                                            </p>
                                                          </div>
                                                        )}

                                                        {question.evidence && (
                                                          <div className="ml-6 mt-2">
                                                            <p className="text-xs font-medium text-blue-700 mb-1">
                                                              Evidence:
                                                            </p>
                                                            <p className="text-sm text-gray-600 italic leading-relaxed">
                                                              "
                                                              {
                                                                question.evidence
                                                              }
                                                              "
                                                            </p>
                                                          </div>
                                                        )}
                                                      </div>
                                                    )
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </ScrollArea>
                                  </TabsContent>

                                  <TabsContent value="transcript">
                                    <ScrollArea className="h-[60vh] pr-4">
                                      {isLoadingTranscript ? (
                                        <div className="flex items-center justify-center py-8">
                                          <Loader2 className="h-6 w-6 animate-spin" />
                                          <span className="ml-2">
                                            Loading transcript...
                                          </span>
                                        </div>
                                      ) : transcript ? (
                                        <div className="space-y-4">
                                          <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono bg-gray-50 p-4 rounded-lg">
                                            {transcript}
                                          </pre>
                                        </div>
                                      ) : (
                                        <div className="text-center py-8">
                                          <p className="text-muted-foreground">
                                            Click to load transcript
                                          </p>
                                        </div>
                                      )}
                                    </ScrollArea>
                                  </TabsContent>
                                </Tabs>
                              </div>
                            ) : (
                              <div className="text-center py-8">
                                <p className="text-muted-foreground">
                                  No report data available
                                </p>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
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
