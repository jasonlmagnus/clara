"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Upload, Loader2, CheckCircle } from "lucide-react";

interface DataInputProps {
  onAnalysisComplete: (reportId: string, filename: string) => void;
}

export default function DataInput({ onAnalysisComplete }: DataInputProps) {
  const [questions] = useState([
    "Thank the client for their time and confirm the confidentiality of the discussion",
    "Briefly explain the purpose of the interview: to understand their needs and challenges related to deal analysis.",
    "Ask for permission to record the call for internal analysis purposes.",
    "Can you walk me through your typical process for evaluating a potential investment or deal?",
    "What are the most critical pieces of information you look for when analyzing a deal?",
    "What are the biggest challenges or pain points you face in your current deal analysis process?",
    "How do you currently use technology or software to assist with deal analysis?",
    "What features in a new tool would be most valuable to you and your team?",
    "Are there any specific metrics or data points you wish you could track more easily?",
    "How do you typically collaborate with your team during the deal analysis process?",
    "What is your budget for new tools that could significantly improve your deal analysis workflow?",
    "Can you describe a time when a deal analysis went particularly well? What made it successful?",
    "Conversely, can you describe a time when a deal analysis was challenging? What went wrong?",
    "What does the final output or report of your deal analysis look like?",
    "Thank the client for their detailed feedback and ask if they have any final questions.",
    "Briefly summarize the next steps, if any (e.g., sending a follow-up email, a demo).",
  ]);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      onAnalysisComplete(result.reportId, result.filename);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setIsProcessing(false);
    }
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Data Input</CardTitle>
        <CardDescription>
          Upload your audio or video file for analysis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid gap-6">
            <div className="grid gap-3">
              <label htmlFor="file-upload" className="font-medium">
                Upload Recording
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                    {file ? (
                      <p className="font-semibold text-primary">{file.name}</p>
                    ) : (
                      <>
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          MP4, MP3, WAV, M4A (MAX. 100MB)
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".mp4,.mp3,.wav,.m4a"
                  />
                </label>
              </div>
            </div>

            <div className="grid gap-3">
              <label className="font-medium">
                Interview Questions Template
              </label>
              <Card className="p-4 bg-muted/50">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {questions.map((q, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </Card>
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

          <div className="flex justify-end">
            <Button type="submit" disabled={isProcessing || !file}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Interview"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
