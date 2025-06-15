"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Loader2 } from "lucide-react";

interface Report {
  report_id: string;
  title: string;
  type: string;
  status: string;
  generated: string;
  dealsAnalyzed: number;
  insights: number;
}

interface ReportsViewProps {
  onViewReport: (reportId: string) => void;
  onGenerateNewReport: () => void;
}

export default function ReportsView({
  onViewReport,
  onGenerateNewReport,
}: ReportsViewProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchReports() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/reports");
      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error(error);
      setReports([]); // Clear reports on error
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate and manage analysis reports and insights
          </p>
        </div>
        <Button onClick={onGenerateNewReport}>
          <FileText className="mr-2 h-4 w-4" />
          Generate New Report
        </Button>
      </div>

      <Tabs defaultValue="existing-reports">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="existing-reports">Existing Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="existing-reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Library</CardTitle>
              <CardDescription>
                Access and manage previously generated reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="w-full flex justify-center items-center h-48">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : reports.length > 0 ? (
                reports.map((report) => (
                  <Card
                    key={report.report_id}
                    className="flex items-center justify-between p-4"
                  >
                    <div className="grid gap-1">
                      <div className="flex items-center gap-4">
                        <h3 className="font-semibold">{report.title}</h3>
                        <Badge variant="outline">{report.type}</Badge>
                        <Badge>{report.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Generated:{" "}
                        {new Date(report.generated).toLocaleDateString()}{" "}
                        &nbsp;&middot;&nbsp; {report.dealsAnalyzed} deals
                        analyzed &nbsp;&middot;&nbsp; {report.insights} insights
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewReport(report.report_id)}
                      >
                        View
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-center text-muted-foreground">
                  No reports found.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
