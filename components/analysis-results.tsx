"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  TrendingUp,
  Target,
  Download,
} from "lucide-react";
import { useClientStore } from "@/lib/client-store";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface MetricResult {
  total: number;
  counts: Record<string, number>;
  percentages: Record<string, number>;
}

const formatLabel = (str: string) =>
  str
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

export default function AnalysisResults() {
  const selectedClient = useClientStore((s) => s.selectedClient);
  const [overview, setOverview] = useState<MetricResult | null>(null);
  const [competitive, setCompetitive] = useState<MetricResult | null>(null);
  const [gaps, setGaps] = useState<MetricResult | null>(null);
  const [trends, setTrends] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchData = async () => {
      const query = selectedClient
        ? `?client=${encodeURIComponent(selectedClient)}`
        : "";
      try {
        const [o, c, g, t] = await Promise.all([
          fetch(`/api/analysis/overview${query}`).then((r) => r.json()),
          fetch(`/api/analysis/competitive${query}`).then((r) => r.json()),
          fetch(`/api/analysis/gaps${query}`).then((r) => r.json()),
          fetch(`/api/analysis/trends${query}`).then((r) => r.json()),
        ]);
        setOverview(o);
        setCompetitive(c);
        setGaps(g);
        setTrends(t);
      } catch (err) {
        console.error("Failed to load analysis", err);
      }
    };
    fetchData();
  }, [selectedClient]);

  const lossItems = overview
    ? Object.entries(overview.percentages)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
    : [];
  const competitorItems = competitive
    ? Object.entries(competitive.percentages).sort((a, b) => b[1] - a[1])
    : [];
  const gapItems = gaps
    ? Object.entries(gaps.percentages).sort((a, b) => b[1] - a[1])
    : [];
  const trendData = Object.entries(trends)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, value]) => ({ date, value }));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analysis Results</h1>
          <p className="text-muted-foreground">
            Insights and findings from closed-lost deal analysis
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Analysis
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="competitive">Competitive Analysis</TabsTrigger>
          <TabsTrigger value="gaps">Gap Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Key Loss Factors
              </CardTitle>
              <CardDescription>
                Primary reasons for lost opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {lossItems.map(([name, value]) => (
                <div key={name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{formatLabel(name)}</span>
                    <span>{value.toFixed(0)}%</span>
                  </div>
                  <Progress value={value} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitive" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                Competitor Positioning
              </CardTitle>
              <CardDescription>How we compare against competitors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {competitorItems.map(([name, value]) => (
                <div key={name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{formatLabel(name)}</span>
                    <span>{value.toFixed(0)}%</span>
                  </div>
                  <Progress value={value} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gaps" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gap Impact Analysis</CardTitle>
              <CardDescription>
                Quantified impact of identified gaps on deal outcomes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {gapItems.map(([name, value]) => (
                <div key={name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{formatLabel(name)}</span>
                    <span>{value.toFixed(0)}%</span>
                  </div>
                  <Progress value={value} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Trend Over Time
              </CardTitle>
            </CardHeader>
            <CardContent style={{ width: "100%", height: 300 }}>
              {trendData.length > 0 && (
                <ResponsiveContainer>
                  <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
