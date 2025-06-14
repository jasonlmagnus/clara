"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileText, Mic, Link } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function DataInput() {
  const [questions, setQuestions] = useState([
    // Opening Section (5 minutes)
    "Thank the client for their time and confirm the confidentiality of the discussion",
    "Emphasize that the purpose is to improve future engagements and that their feedback is greatly valued",
    "Briefly recap the opportunity, including the solution offered, timeline, and key decision points",

    // Understanding the Decision (10-15 minutes)
    "Could you share the top factors influencing your decision?",
    "How did our proposal compare to the chosen provider in terms of: Pricing, Service capability, Product fit/alignment with your specific needs [Rate: Positive/Neutral/Negative]",
    "Were there any specific gaps or areas where our offering didn't meet your expectations?",
    "Without naming them, what aspects of the chosen provider's offering stood out to your team?",
    "Did the competitor offer anything innovative or particularly compelling that tipped the scales?",

    // Relationship and Engagement (10-15 minutes)
    "How would you describe your experience working with our team? (Communication, Responsiveness, Understanding of your needs)",
    "Were there moments in the process where our approach stood out, either positively or negatively?",
    "How would you describe the chemistry and collaboration between your team and ours?",
    "Did any specific interactions, meetings, or presentations stand out positively or negatively?",
    "Despite this decision, do you see potential opportunities for us to work together in the future?",
    "What would you need to see from us to feel more confident in choosing us for a future project?",
  ])

  const addQuestion = () => {
    setQuestions([...questions, ""])
  }

  const updateQuestion = (index: number, value: string) => {
    const updated = [...questions]
    updated[index] = value
    setQuestions(updated)
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data Input</h1>
        <p className="text-muted-foreground">Upload transcripts, recordings, and configure interview questions</p>
      </div>

      <Tabs defaultValue="transcript" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
          <TabsTrigger value="recording">Recording</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
        </TabsList>

        <TabsContent value="transcript" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Interview Transcript
              </CardTitle>
              <CardDescription>Upload or paste the interview transcript for analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium mb-2">Drop transcript file here</p>
                <p className="text-sm text-muted-foreground mb-4">Supports .txt, .docx, .pdf files up to 10MB</p>
                <Button>Choose File</Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or paste text</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transcript">Transcript Text</Label>
                <Textarea
                  id="transcript"
                  placeholder="Paste the interview transcript here..."
                  className="min-h-[200px]"
                />
              </div>

              <Button className="w-full">Process Transcript</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recording" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Interview Recording
              </CardTitle>
              <CardDescription>Upload recording files or provide links to MS Teams recordings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-medium">Upload Recording</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Mic className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm font-medium mb-1">Drop audio file here</p>
                    <p className="text-xs text-muted-foreground mb-3">MP3, WAV, M4A up to 100MB</p>
                    <Button size="sm">Choose File</Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Recording Link</h3>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="recording-link">MS Teams Recording URL</Label>
                      <Input id="recording-link" placeholder="https://teams.microsoft.com/..." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recording-email">Or Email to Marketing</Label>
                      <Input
                        id="recording-email"
                        placeholder="marketing@company.com"
                        disabled
                        value="marketing@company.com"
                      />
                    </div>
                    <Button variant="outline" className="w-full">
                      <Link className="h-4 w-4 mr-2" />
                      Send Link
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Recordings will be automatically deleted once the transcript is generated to
                  ensure data privacy and compliance.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>CLARA Interview Questions</CardTitle>
              <CardDescription>Standardized question set for 30-minute client feedback interviews</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Interview Structure Overview */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Interview Structure (30 minutes total)</h3>
                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Opening</span>
                    <span className="text-blue-600">5 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Understanding the Decision</span>
                    <span className="text-blue-600">10-15 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Relationship and Engagement</span>
                    <span className="text-blue-600">10-15 minutes</span>
                  </div>
                </div>
              </div>

              {/* Opening Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Opening - 5 minutes</Badge>
                </div>
                {questions.slice(0, 3).map((question, index) => (
                  <div key={index} className="p-3 border rounded-lg bg-gray-50">
                    <div className="text-sm font-medium text-gray-700">
                      {index + 1}. {question}
                    </div>
                  </div>
                ))}
              </div>

              {/* Understanding the Decision Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Understanding the Decision - 10-15 minutes</Badge>
                </div>
                {questions.slice(3, 8).map((question, index) => (
                  <div key={index + 3} className="p-3 border rounded-lg">
                    <div className="text-sm font-medium">
                      {index + 4}. {question}
                    </div>
                  </div>
                ))}
              </div>

              {/* Relationship and Engagement Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Relationship and Engagement - 10-15 minutes</Badge>
                </div>
                {questions.slice(8).map((question, index) => (
                  <div key={index + 8} className="p-3 border rounded-lg">
                    <div className="text-sm font-medium">
                      {index + 9}. {question}
                    </div>
                  </div>
                ))}
              </div>

              {/* Interview Guidelines */}
              <div className="bg-amber-50 p-4 rounded-lg">
                <h4 className="font-semibold text-amber-800 mb-2">Interview Guidelines</h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Interview will be recorded via MS Teams for transcript use only</li>
                  <li>• Recording will be deleted once transcript is downloaded</li>
                  <li>• Confirm confidentiality of the discussion at the start</li>
                  <li>• Focus on improvement opportunities for future engagements</li>
                </ul>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">Export Question Set</Button>
                <Button variant="outline">Email Template</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metadata" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Deal Metadata</CardTitle>
              <CardDescription>Additional information about the opportunity and interview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input id="company" placeholder="Enter company name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deal-value">Deal Value</Label>
                  <Input id="deal-value" placeholder="$0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-lead">Account Lead</Label>
                  <Input id="account-lead" placeholder="Enter account lead name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interview-date">Interview Date</Label>
                  <Input id="interview-date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="competitor">Primary Competitor</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select competitor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="competitor-a">Competitor A</SelectItem>
                      <SelectItem value="competitor-b">Competitor B</SelectItem>
                      <SelectItem value="competitor-c">Competitor C</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional context or notes about the opportunity..."
                  className="min-h-[100px]"
                />
              </div>

              <Button className="w-full">Save Metadata</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
