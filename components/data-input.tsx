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
import { Upload, Loader2, CheckCircle } from "lucide-react";
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
    "How would you describe your experience with our team? (Communication, Responsiveness, Understanding of your needs)",
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
  const [transcript, setTranscript] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const [metadata, setMetadata] = useState({
    company: "",
    dealValue: "",
    accountLead: "",
    interviewDate: "",
    competitor: "",
    industry: "",
    notes: "",
  });
  const [activeTab, setActiveTab] = useState("metadata");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleMetadataChange = (
    field: keyof typeof metadata,
    value: string
  ) => {
    setMetadata((prev) => ({ ...prev, [field]: value }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !transcript.trim()) {
      setError("Please select a file or paste transcript text to analyze.");
      return;
    }

    if (!metadata.company) {
      setError(
        "Please complete the company name in the Metadata tab before analyzing."
      );
      setActiveTab("metadata");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setAnalysisResult(null);

    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    if (transcript.trim()) {
      formData.append("transcript", transcript);
    }
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
            setTranscript("");
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
          Upload data and configure interview questions
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
          </TabsList>

          <TabsContent value="metadata">
            <Card>
              <CardHeader>
                <CardTitle>Deal Management</CardTitle>
                <CardDescription>
                  Enter the metadata for the deal you are analyzing.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      placeholder="e.g. Acme Inc."
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
                      placeholder="e.g. $100,000"
                      value={metadata.dealValue}
                      onChange={(e) =>
                        handleMetadataChange("dealValue", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="account-lead">Account Lead</Label>
                    <Input
                      id="account-lead"
                      placeholder="e.g. John Doe"
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
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="competitor">Competitor</Label>
                    <Input
                      id="competitor"
                      placeholder="e.g. Globex Corp."
                      value={metadata.competitor}
                      onChange={(e) =>
                        handleMetadataChange("competitor", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      placeholder="e.g. Technology"
                      value={metadata.industry}
                      onChange={(e) =>
                        handleMetadataChange("industry", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Internal Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="e.g. Key decision-maker was on vacation..."
                    value={metadata.notes}
                    onChange={(e) =>
                      handleMetadataChange("notes", e.target.value)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            {!metadata.company ? (
              <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                <p className="mb-4 text-muted-foreground">
                  Please provide a Company Name in the 'Metadata' tab before
                  uploading data.
                </p>
                <Button onClick={() => setActiveTab("metadata")}>
                  Go to Metadata
                </Button>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Upload Data
                  </CardTitle>
                  <CardDescription>
                    Upload a recording or transcript, or paste the transcript
                    text.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="file-upload">
                      Audio, Video or Document File
                    </Label>
                    <div
                      className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        dragActive
                          ? "border-primary bg-primary/5"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <input
                        id="file-upload"
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleFileChange}
                        accept="audio/*,video/*,.txt,.doc,.docx,.pdf"
                      />
                      <div className="space-y-2">
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                        <div className="text-sm">
                          <span className="font-medium text-primary">
                            Click to upload
                          </span>{" "}
                          or drag and drop
                        </div>
                        <div className="text-xs text-gray-500">
                          Audio, video, or document files (MP3, MP4, TXT, DOC,
                          PDF)
                        </div>
                      </div>
                    </div>
                    {file && (
                      <div className="text-sm text-muted-foreground">
                        Selected file: {file.name} (
                        {(file.size / 1024 / 1024).toFixed(2)} MB)
                      </div>
                    )}
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
                      value={transcript}
                      onChange={(e) => setTranscript(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button
                      type="submit"
                      disabled={isProcessing || (!file && !transcript.trim())}
                    >
                      {isProcessing && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {isProcessing ? "Analyzing..." : "Analyze"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
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
                    <div
                      key={index}
                      className="p-3 border rounded-lg bg-gray-50"
                    >
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
                      • Interview will be recorded via MS Teams for transcript
                      use only
                    </li>
                    <li>
                      • Recording will be deleted once transcript is downloaded
                    </li>
                    <li>
                      • Confirm confidentiality of the discussion at the start
                    </li>
                    <li>
                      • Focus on improvement opportunities for future
                      engagements
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
        </Tabs>
      </form>
    </div>
  );
}
