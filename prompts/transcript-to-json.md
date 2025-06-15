# Transcript to Structured JSON Prompt

## Goal

Your task is to analyze the provided interview transcript and convert it into a structured JSON object based on the provided template. You must accurately extract the client's answers and reasoning from the transcript and place them into the correct fields in the JSON structure.

## Input

You will be given two pieces of information:

1.  **The Transcript:** A raw text of the client feedback interview.
2.  **The JSON Template:** The structure to be filled out.

## Output

You must return a single, valid JSON object that follows the template structure but is populated with information from the transcript.

## Instructions

1.  **Adhere to the JSON structure strictly.** Do not add, remove, or rename any keys from the provided template unless specified.
2.  **Populate the `answer` field:** For each question object within the `questions` arrays, you must add a new key-value pair: `"answer": "..."`. The value should be a concise summary of the client's answer to that specific question, synthesized from the transcript.
3.  **Provide Evidence:** For each question, also add a new key-value pair: `"evidence": "..."`. The value should be a direct quote from the transcript that serves as evidence for your summarized answer.
4.  **Handle Missing Information:** If the transcript does not contain an answer to a specific question, the value for the `answer` and `evidence` fields should be `null`.
5.  **Analyze Sentiment (Question 2):** For the question "How did our proposal compare...", analyze the client's response for each sub-point (Pricing, Service capability, Product fit). Replace the `"[Positive/Neutral/Negative]"` placeholder in the `note` field with your analysis for each, e.g., `"note": "Pricing: Negative, Service capability: Positive, Product fit: Neutral"`.
6.  **Leave static fields unchanged:** Fields like `project_name`, `description`, `interview_details`, and the structure itself should remain as they are in the template. Your task is to fill in the conversational data.
7.  **Ignore the `sources` key:** The `sources` key in the template contains numerical placeholders. You can ignore this key in your final output, or return it as an empty array `[]`.

## JSON Template to be filled

```json
{
  "project_name": "CLARA",
  "description": "CLARA aims to uncover the underlying reasons why potential clients chose competitors or paused their work, gathering insights directly from clients to identify gaps in a value proposition, improve commercial strategies, pinpoint product strengths/weaknesses, pricing gaps, and service and sales deficiencies. By systematically gathering and analyzing feedback, CLARA can enhance strategies, increase win rates, and better serve the market [1, 2].",
  "interview_details": {
    "purpose": "The purpose is to improve future engagements and the client's feedback is greatly valued [3].",
    "format": "Recorded 30-minute interview via MS Teams [3, 4].",
    "recording_policy": "The interview will be recorded for transcript use only, and the recording will be deleted once the transcript is downloaded [3].",
    "confidentiality": "Confirm the confidentiality of the discussion [3]."
  },
  "interview_structure": [
    {
      "section_title": "Opening",
      "duration": "5 minutes",
      "points": [
        "Thank the client for their time and confirm the confidentiality of the discussion [3].",
        "Emphasize that the purpose is to improve future engagements and that their feedback is greatly valued [3].",
        "Briefly recap the opportunity, including the solution offered, timeline, and key decision points [3]."
      ]
    },
    {
      "section_title": "Understanding the Decision",
      "duration": "10-15 minutes",
      "questions": [
        {
          "number": 1,
          "text": "Could you share the top factors influencing your decision?",
          "sources": [3, 5]
        },
        {
          "number": 2,
          "text": "How did our proposal compare to the chosen provider in terms of:",
          "sub_points": [
            "Pricing",
            "Service capability",
            "Product fit/alignment with your specific needs"
          ],
          "note": "[Positive/Neutral/Negative]",
          "sources": [5, 6]
        },
        {
          "number": 3,
          "text": "Were there any specific gaps or areas where our offering didn't meet your expectations?",
          "sources": [5, 6]
        },
        {
          "number": 4,
          "text": "Without naming them, what aspects of the chosen provider's offering stood out to your team?",
          "sources": [5]
        },
        {
          "number": 5,
          "text": "Did the competitor offer anything innovative or particularly compelling that tipped the scales?",
          "sources": [6, 7]
        }
      ]
    },
    {
      "section_title": "Relationship and Engagement",
      "duration": "10-15 minutes",
      "questions": [
        {
          "number": 6,
          "text": "How would you describe your experience working with our team?",
          "sub_points": [
            "Communication",
            "Responsiveness",
            "Understanding of your needs"
          ],
          "sources": [7, 8]
        },
        {
          "number": 7,
          "text": "Were there moments in the process where our approach stood out, either positively or negatively?",
          "sources": [8]
        },
        {
          "number": 8,
          "text": "How would you describe the chemistry and collaboration between your team and ours?",
          "sources": [7]
        },
        {
          "number": 9,
          "text": "Did any specific interactions, meetings, or presentations stand out positively or negatively?",
          "sources": [9]
        },
        {
          "number": 10,
          "text": "Despite this decision, do you see potential opportunities for us to work together in the future?",
          "sources": [8, 9]
        },
        {
          "number": 11,
          "text": "What would you need to see from us to feel more confident in choosing us for a future project?",
          "sources": [9]
        }
      ]
    }
  ]
}
```
