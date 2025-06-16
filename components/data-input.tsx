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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  FileText,
  Mic,
  Link,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  ]);

  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);

  const [metadata, setMetadata] = useState({
    company: "",
    dealValue: "",
    accountLead: "",
    interviewDate: "",
    competitor: "",
    industry: "",
    notes: "",
  });
  const [metadataSaved, setMetadataSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("metadata");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleMetadataChange = (field: string, value: string) => {
    setMetadata((prev) => ({ ...prev, [field]: value }));
  };

  const saveMetadata = () => {
    if (metadata.company && metadata.accountLead && metadata.interviewDate) {
      setMetadataSaved(true);
      setActiveTab("transcript");
    } else {
      setError("Please fill in Company, Account Lead and Interview Date.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!metadataSaved) {
      setError("Please save metadata before analyzing.");
      setActiveTab("metadata");
      return;
    }
    if (!file) {
      setError("Please select a file to analyze.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("questions", JSON.stringify(questions));
    formData.append("metadata", JSON.stringify(metadata));

    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "An unknown error occurred.");
      }

      setAnalysisResult(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, ""]);
  };

  const updateQuestion = (index: number, value: string) => {
    const updated = [...questions];
    updated[index] = value;
    setQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  if (analysisResult) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <p className="text-lg font-medium text-green-800">Analysis Complete</p>
        <p className="text-sm text-muted-foreground mb-6">
          Your report for "{analysisResult.filename}" is ready. You can view it
          in the 'Reports' tab.
        </p>
        <Button
          onClick={() => {
            setAnalysisResult(null);
            setFile(null);
          }}
        >
          Create Another Report
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data Input</h1>
        <p className="text-muted-foreground">
          Upload transcripts, recordings, and configure interview questions
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(val) => {
          if (!metadataSaved && val !== "metadata") {
            setError("Please save metadata before proceeding.");
            setActiveTab("metadata");
          } else {
            setError(null);
            setActiveTab(val);
          }
        }}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
          <TabsTrigger value="recording">Recording</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
        </TabsList>

        <TabsContent value="transcript" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Interview Transcript
              </CardTitle>
              <CardDescription>
                Upload or paste the interview transcript for analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium mb-2">
                  Drop transcript file here
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Supports .txt, .docx, .pdf files up to 10MB
                </p>
                <Button>Choose File</Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or paste text
                  </span>
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
              <CardDescription>
                Upload recording files or provide links to MS Teams recordings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="font-medium">Upload Recording</h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Mic className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      {file ? (
                        <p className="font-semibold text-primary">
                          {file.name}
                        </p>
                      ) : (
                        <>
                          <p className="text-sm font-medium mb-1">
                            Drop audio file here
                          </p>
                          <p className="text-xs text-muted-foreground mb-3">
                            MP3, WAV, M4A up to 100MB
                          </p>
                        </>
                      )}
                      <input
                        type="file"
                        className="hidden"
                        id="audio-upload"
                        onChange={handleFileChange}
                        accept=".mp4,.mp3,.wav,.m4a"
                      />
                      <label htmlFor="audio-upload">
                        <Button size="sm" type="button" asChild>
                          <span>Choose File</span>
                        </Button>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Recording Link</h3>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="recording-link">
                          MS Teams Recording URL
                        </Label>
                        <Input
                          id="recording-link"
                          placeholder="https://teams.microsoft.com/..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="recording-email">
                          Or Email to Marketing
                        </Label>
                        <Input
                          id="recording-email"
                          placeholder="marketing@company.com"
                          disabled
                          value="marketing@company.com"
                        />
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        type="button"
                      >
                        <Link className="h-4 w-4 mr-2" />
                        Send Link
                      </Button>
                    </div>
                  </div>
                </div>

                {error && (
                  <div
                    className="p-4 text-sm text-red-700 bg-red-100 border-l-4 border-red-500"
                    role="alert"
                  >
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                  </div>
                )}

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Recordings will be automatically
                    deleted once the transcript is generated to ensure data
                    privacy and compliance.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isProcessing || !file}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Interview"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>CLARA Interview Questions</CardTitle>
              <CardDescription>
                Standardized question set for 30-minute client feedback
                interviews
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Interview Structure Overview */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">
                  Interview Structure (30 minutes total)
                </h3>
                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Opening</span>
                    <span className="text-blue-600">5 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">
                      Understanding the Decision
                    </span>
                    <span className="text-blue-600">10-15 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">
                      Relationship and Engagement
                    </span>
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
                  <Badge variant="outline">
                    Understanding the Decision - 10-15 minutes
                  </Badge>
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
                  <Badge variant="outline">
                    Relationship and Engagement - 10-15 minutes
                  </Badge>
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
                <h4 className="font-semibold text-amber-800 mb-2">
                  Interview Guidelines
                </h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>
                    • Interview will be recorded via MS Teams for transcript use
                    only
                  </li>
                  <li>
                    • Recording will be deleted once transcript is downloaded
                  </li>
                  <li>
                    • Confirm confidentiality of the discussion at the start
                  </li>
                  <li>
                    • Focus on improvement opportunities for future engagements
                  </li>
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
              <CardDescription>
                Additional information about the opportunity and interview
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    placeholder="Enter company name"
                    value={metadata.company}
                    onChange={(e) =>
                      handleMetadataChange("company", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deal-value">Deal Value</Label>
                  <Input
                    id="deal-value"
                    placeholder="$0.00"
                    value={metadata.dealValue}
                    onChange={(e) =>
                      handleMetadataChange("dealValue", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-lead">Account Lead</Label>
                  <Input
                    id="account-lead"
                    placeholder="Enter account lead name"
                    value={metadata.accountLead}
                    onChange={(e) =>
                      handleMetadataChange("accountLead", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interview-date">Interview Date</Label>
                  <Input
                    id="interview-date"
                    type="date"
                    value={metadata.interviewDate}
                    onChange={(e) =>
                      handleMetadataChange("interviewDate", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="competitor">Primary Competitor</Label>
                  <Select
                    value={metadata.competitor}
                    onValueChange={(v) => handleMetadataChange("competitor", v)}
                  >
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
                  <Select
                    value={metadata.industry}
                    onValueChange={(v) => handleMetadataChange("industry", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="manufacturing">
                        Manufacturing
                      </SelectItem>
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
                  value={metadata.notes}
                  onChange={(e) => handleMetadataChange("notes", e.target.value)}
                />
              </div>

              <Button className="w-full" onClick={saveMetadata}>
                Save Metadata
              </Button>
              </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
