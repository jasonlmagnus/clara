"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { AlertTriangle, TrendingDown, TrendingUp, Target, Download } from "lucide-react"

export default function AnalysisResults() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analysis Results</h1>
          <p className="text-muted-foreground">Insights and findings from closed-lost deal analysis</p>
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
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Key Loss Factors
                </CardTitle>
                <CardDescription>Primary reasons for lost opportunities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Pricing Concerns</span>
                    <Badge variant="destructive">High Impact</Badge>
                  </div>
                  <Progress value={75} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    34% of deals lost due to pricing being above budget or uncompetitive
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Feature Gaps</span>
                    <Badge variant="secondary">Medium Impact</Badge>
                  </div>
                  <Progress value={60} className="h-2" />
                  <p className="text-xs text-muted-foreground">28% cited missing features or functionality</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Implementation Timeline</span>
                    <Badge variant="secondary">Medium Impact</Badge>
                  </div>
                  <Progress value={45} className="h-2" />
                  <p className="text-xs text-muted-foreground">22% needed faster deployment than we could offer</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Competitive Positioning
                </CardTitle>
                <CardDescription>How we compare against competitors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Product Features</span>
                    <Badge variant="outline">Neutral</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "60%" }}></div>
                    </div>
                    <span className="text-xs text-muted-foreground">60%</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Pricing</span>
                    <Badge variant="destructive">Negative</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: "35%" }}></div>
                    </div>
                    <span className="text-xs text-muted-foreground">35%</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Support & Service</span>
                    <Badge variant="default">Positive</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "80%" }}></div>
                    </div>
                    <span className="text-xs text-muted-foreground">80%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Analysis Summary</CardTitle>
              <CardDescription>Latest insights from completed interviews</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold">TechCorp Solutions Analysis</h4>
                  <p className="text-sm text-muted-foreground mb-2">Completed 2 hours ago</p>
                  <p className="text-sm">
                    Primary loss factor: Pricing (40% above budget). Secondary concerns around integration complexity
                    and timeline. Competitor A won with 25% lower pricing and faster implementation promise.
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold">InnovateCo Analysis</h4>
                  <p className="text-sm text-muted-foreground mb-2">Completed 1 day ago</p>
                  <p className="text-sm">
                    Strong product fit but lost on advanced analytics features. Client specifically needed real-time
                    dashboard capabilities that Competitor C offered out-of-the-box.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitive" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Competitor A</CardTitle>
                <CardDescription>Most frequent winner</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Win Rate Against Us</span>
                  <Badge variant="destructive">45%</Badge>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-green-600">Strengths</h4>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Aggressive pricing strategy</li>
                    <li>• Faster implementation</li>
                    <li>• Strong enterprise features</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-red-600">Weaknesses</h4>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Limited customization</li>
                    <li>• Poor customer support</li>
                    <li>• Scalability concerns</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Competitor B</CardTitle>
                <CardDescription>Feature-focused competitor</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Win Rate Against Us</span>
                  <Badge variant="secondary">28%</Badge>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-green-600">Strengths</h4>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Advanced analytics</li>
                    <li>• Modern UI/UX</li>
                    <li>• API-first approach</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-red-600">Weaknesses</h4>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Higher pricing</li>
                    <li>• Complex setup</li>
                    <li>• Limited integrations</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Competitor C</CardTitle>
                <CardDescription>Niche specialist</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Win Rate Against Us</span>
                  <Badge variant="outline">18%</Badge>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-green-600">Strengths</h4>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Industry specialization</li>
                    <li>• Compliance features</li>
                    <li>• Expert support team</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-red-600">Weaknesses</h4>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Limited scalability</li>
                    <li>• Outdated technology</li>
                    <li>• Small market presence</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="gaps" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Critical Gaps</CardTitle>
                <CardDescription>High-impact areas requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <h4 className="font-semibold text-red-800">Pricing Strategy</h4>
                  <p className="text-sm text-red-700 mt-1">
                    Consistently 20-30% higher than competitors. Need flexible pricing tiers.
                  </p>
                </div>
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <h4 className="font-semibold text-red-800">Real-time Analytics</h4>
                  <p className="text-sm text-red-700 mt-1">
                    Missing advanced dashboard and real-time reporting capabilities.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">Moderate Gaps</CardTitle>
                <CardDescription>Important improvements for competitive advantage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                  <h4 className="font-semibold text-orange-800">Implementation Speed</h4>
                  <p className="text-sm text-orange-700 mt-1">
                    Average 6-8 weeks vs competitors' 2-4 weeks deployment time.
                  </p>
                </div>
                <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                  <h4 className="font-semibold text-orange-800">Mobile Experience</h4>
                  <p className="text-sm text-orange-700 mt-1">
                    Mobile app functionality lags behind web platform capabilities.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Gap Impact Analysis</CardTitle>
              <CardDescription>Quantified impact of identified gaps on deal outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Pricing Competitiveness</h4>
                    <p className="text-sm text-muted-foreground">Impact on deal closure rate</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600">-34%</div>
                    <p className="text-xs text-muted-foreground">Deal success rate</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Feature Completeness</h4>
                    <p className="text-sm text-muted-foreground">Missing functionality impact</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-600">-28%</div>
                    <p className="text-xs text-muted-foreground">Deal success rate</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Implementation Timeline</h4>
                    <p className="text-sm text-muted-foreground">Speed to value concerns</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-600">-22%</div>
                    <p className="text-xs text-muted-foreground">Deal success rate</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Positive Trends
                </CardTitle>
                <CardDescription>Improving areas over time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Customer Support Satisfaction</span>
                  <Badge variant="default">+15%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Product Reliability Perception</span>
                  <Badge variant="default">+12%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sales Process Efficiency</span>
                  <Badge variant="default">+8%</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                  Concerning Trends
                </CardTitle>
                <CardDescription>Areas requiring attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Price Competitiveness</span>
                  <Badge variant="destructive">-18%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Feature Completeness</span>
                  <Badge variant="destructive">-12%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Time to Implementation</span>
                  <Badge variant="destructive">-9%</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quarterly Trend Analysis</CardTitle>
              <CardDescription>Win rate and key metrics over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">Q1 2024</div>
                    <div className="text-sm text-muted-foreground">Win Rate: 32%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">Q2 2024</div>
                    <div className="text-sm text-muted-foreground">Win Rate: 28%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">Q3 2024</div>
                    <div className="text-sm text-muted-foreground">Win Rate: 25%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">Q4 2024</div>
                    <div className="text-sm text-muted-foreground">Win Rate: 30%</div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Key Insights</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Q4 shows improvement after implementing pricing adjustments</li>
                    <li>• Consistent feedback on feature gaps throughout the year</li>
                    <li>• Support satisfaction improvements correlate with better outcomes</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
