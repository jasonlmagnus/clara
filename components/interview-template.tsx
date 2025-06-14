"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Mail, Send } from "lucide-react"

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
[Contact Information]`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(emailTemplate)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Interview Request Email Template
          </CardTitle>
          <CardDescription>Standardized template for requesting client feedback interviews</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="client-name">Client Name</Label>
                <Input id="client-name" placeholder="Enter client name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input id="company-name" placeholder="Enter company name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-type">Project/Solution Type</Label>
                <Input id="project-type" placeholder="e.g., CRM implementation" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="your-name">Your Name</Label>
                <Input id="your-name" placeholder="Enter your name" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-template">Email Template</Label>
              <Textarea
                id="email-template"
                value={emailTemplate}
                className="min-h-[400px] font-mono text-sm"
                readOnly
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={copyToClipboard} variant="outline" className="flex items-center gap-2">
                <Copy className="h-4 w-4" />
                Copy Template
              </Button>
              <Button className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Send Email
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Interview Scheduling Guidelines</CardTitle>
          <CardDescription>Best practices for scheduling and conducting interviews</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-semibold text-green-600">Do's</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Schedule within 2-4 weeks of decision</li>
                  <li>• Offer multiple time slot options</li>
                  <li>• Confirm confidentiality upfront</li>
                  <li>• Send calendar invite with Teams link</li>
                  <li>• Follow up if no response within 1 week</li>
                  <li>• Prepare brief opportunity recap</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-red-600">Don'ts</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Don't be pushy or persistent</li>
                  <li>• Don't ask for competitor names</li>
                  <li>• Don't make it a sales pitch</li>
                  <li>• Don't exceed 30 minutes</li>
                  <li>• Don't share recording with others</li>
                  <li>• Don't take feedback personally</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Success Tips</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Response rate typically 30-40% for recent opportunities</li>
                <li>• Higher success when account lead has strong relationship</li>
                <li>• Best timing is 1-3 weeks after their decision announcement</li>
                <li>• Emphasize learning and improvement, not sales</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
