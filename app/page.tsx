"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Navigation from "@/components/navigation";
import DataInput from "@/components/data-input";
import ReportsView from "@/components/reports-view";
import AnalysisReport from "@/components/analysis-report";
import Dashboard from "@/components/dashboard";
import DealManagement from "@/components/deal-management";
import AnalysisResults from "@/components/analysis-results";
import InterviewTemplate from "@/components/interview-template";

export default function ClaraSystem() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [viewingReportId, setViewingReportId] = useState<string | null>(null);
  const [reportData, setReportData] = useState<any | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  useEffect(() => {
    const fetchReportData = async () => {
      if (!viewingReportId) return;
      setIsLoadingReport(true);
      try {
        const res = await fetch(`/api/reports/${viewingReportId}`);
        if (res.ok) {
          const data = await res.json();
          setReportData(data);
        } else {
          setReportData(null);
        }
      } catch (error) {
        console.error("Failed to fetch report", error);
        setReportData(null);
      } finally {
        setIsLoadingReport(false);
      }
    };

    if (viewingReportId) {
      fetchReportData();
    }
  }, [viewingReportId]);

  const handleAnalysisComplete = (reportId: string, filename: string) => {
    // Navigate to the reports tab and show the new report.
    setActiveTab("reports");
    setViewingReportId(reportId);
  };

  const handleViewReport = (reportId: string) => {
    // This is called from the ReportsView list.
    // It sets the report to view, and the main useEffect will fetch the data.
    setViewingReportId(reportId);
  };

  const handleBackToReports = () => {
    setViewingReportId(null);
    setReportData(null);
    // Stay on the reports tab
    setActiveTab("reports");
  };

  const renderContent = () => {
    // If we have a reportId to view, we MUST be on the reports tab.
    // Show the detailed report view instead of the list.
    if (viewingReportId && activeTab === "reports") {
      if (isLoadingReport) {
        return (
          <div className="w-full flex justify-center items-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        );
      }
      if (reportData) {
        return (
          <AnalysisReport data={reportData} onBack={handleBackToReports} />
        );
      }
      // Handle case where report fails to load
      return (
        <div className="text-center">
          <p>Report not found or failed to load.</p>
          <button
            onClick={handleBackToReports}
            className="mt-4 p-2 border rounded"
          >
            Back to reports
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "input":
        return <DataInput onAnalysisComplete={handleAnalysisComplete} />;
      case "deals":
        return <DealManagement />;
      case "analysis":
        return <AnalysisResults />;
      case "reports":
        // When no specific report is being viewed, show the list.
        return (
          <ReportsView
            onViewReport={handleViewReport}
            onGenerateNewReport={() => setActiveTab("input")}
          />
        );
      case "template":
        return <InterviewTemplate />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="container mx-auto px-4 py-8">{renderContent()}</main>
    </div>
  );
}
