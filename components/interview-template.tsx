"use client";

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
import { Copy, Mail, Send } from "lucide-react";

export default function InterviewTemplate() {
  const emailTemplate = `Subject: Request for Brief Feedback Interview - [Company Name] Opportunity

Dear [Client Name],

I hope this message finds you well. Thank you for considering us for your recent [project/solution type] opportunity.

While we understand you've moved forward with another provider, we would greatly value the opportunity to learn from your decision-making process. Your insights would help us improve our future engagements and better serve clients like yourself.

Would you be available for a brief 30-minute feedback interview via MS Teams? We'd like to understand:
- Key factors that influenced your decision
- How our proposal compared to the chosen solution
- Areas where we could improve our approach

Interview Details:
- Duration: 30 minutes
- Format: MS Teams (recorded for transcript purposes only)
- Confidentiality: All discussions will remain strictly confidential
- Recording Policy: The recording will be deleted once we've created the transcript

Your feedback is invaluable to us, and we're committed to using these insights to enhance our services. Would [suggest 2-3 time slots] work for your schedule?

Thank you for your time and consideration.

Best regards,
[Your Name]
[Your Title]
[Company Name]
[Contact Information]`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(emailTemplate);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview Template</CardTitle>
        <CardDescription>Coming soon...</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is where the interview template content will go.</p>
      </CardContent>
    </Card>
  );
}
