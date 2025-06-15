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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  Upload,
  PlusCircle,
  Eye,
  Target,
} from "lucide-react";
import Navigation from "@/components/navigation";
import DataInput from "@/components/data-input";
import DealManagement from "@/components/deal-management";
import ReportsView from "@/components/reports-view";
import AnalysisResults from "@/components/analysis-results";
import InterviewTemplate from "@/components/interview-template";

export default function ClaraSystem() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "input":
        return <DataInput />;
      case "deals":
        return <DealManagement />;
      case "analysis":
        return <AnalysisResults />;
      case "reports":
        return <ReportsView />;
      case "template":
        return <InterviewTemplate />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="container mx-auto px-4 py-8">{renderContent()}</main>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CLARA Dashboard</h1>
          <p className="text-muted-foreground">
            Closed Lost Analysis & Reporting Analytics
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          New Analysis
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Interviews
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Win Rate Improvement
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+8.3%</div>
            <p className="text-xs text-muted-foreground">
              Since implementing CLARA
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground">Awaiting analysis</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Reports Generated
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">This quarter</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest interviews and analyses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  TechCorp Interview Completed
                </p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
              <Badge variant="secondary">Processed</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  GlobalTech Analysis Started
                </p>
                <p className="text-xs text-muted-foreground">4 hours ago</p>
              </div>
              <Badge variant="outline">In Progress</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  InnovateCo Report Generated
                </p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
              <Badge variant="default">Complete</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Top Loss Reasons */}
        <Card>
          <CardHeader>
            <CardTitle>Top Loss Reasons</CardTitle>
            <CardDescription>
              Most common reasons for lost deals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Pricing</span>
                <span>34%</span>
              </div>
              <Progress value={34} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Feature Gaps</span>
                <span>28%</span>
              </div>
              <Progress value={28} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Implementation Timeline</span>
                <span>22%</span>
              </div>
              <Progress value={22} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Support Concerns</span>
                <span>16%</span>
              </div>
              <Progress value={16} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and workflows</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Upload className="h-6 w-6" />
              Upload Transcript
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <BarChart3 className="h-6 w-6" />
              Generate Report
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Eye className="h-6 w-6" />
              View Trends
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
