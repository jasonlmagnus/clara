import fs from 'fs-extra'
import path from 'path'

export interface ParsedAnswer {
  question: string
  answer: string
  evidence?: string
}

export interface ParsedReport {
  reportId: string
  client: string
  competitor?: string
  pricingSentiment?: PricingSentiment
  notes?: string
  timestamp: string
  qa: ParsedAnswer[]
}

export type PricingSentiment = 'positive' | 'negative' | 'neutral' | 'mixed'

export async function getClientFolders(storageDir: string): Promise<string[]> {
  const entries = await fs.readdir(storageDir, { withFileTypes: true })
  return entries.filter((e) => e.isDirectory()).map((e) => path.join(storageDir, e.name))
}

export async function parseReport(reportDir: string): Promise<ParsedReport | null> {
  const reportPath = path.join(reportDir, 'report.json')
  const metadataPath = path.join(reportDir, 'metadata.json')

  if (!(await fs.pathExists(reportPath))) return null

  try {
    const report = await fs.readJson(reportPath)
    const meta = (await fs.pathExists(metadataPath)) ? await fs.readJson(metadataPath) : {}

    const qa: ParsedAnswer[] = []
    for (const section of report.interview_structure ?? []) {
      for (const q of section.questions ?? []) {
        if (q.answer) {
          qa.push({ question: q.text, answer: q.answer, evidence: q.evidence })
        }
      }
    }

    const pricingText = qa
      .filter((a) => /price|pricing|cost/i.test(a.question) || /price|pricing|cost/i.test(a.answer))
      .map((a) => `${a.answer} ${a.evidence ?? ''}`)
      .join(' ')
    const pricingSentiment = pricingText ? analyzePricingSentiment(pricingText) : undefined

    return {
      reportId: meta.report_id ?? path.basename(reportDir),
      client: meta.company ?? '',
      competitor: meta.competitor,
      pricingSentiment,
      notes: meta.notes,
      timestamp: meta.interviewDate ?? meta.created_at ?? '',
      qa,
    }
  } catch (err) {
    console.error(`Failed to parse report in ${reportDir}:`, err)
    return null
  }
}

export function analyzePricingSentiment(text: string): PricingSentiment {
  const lc = text.toLowerCase()
  const positives = [/\bpositive\b/, /\bgood\b/, /\bcompetitive\b/, /\baffordable\b/]
  const negatives = [/\bnegative\b/, /\bbad\b/, /\bexpensive\b/, /\bhigh\b/]
  let score = 0
  for (const p of positives) if (p.test(lc)) score++
  for (const n of negatives) if (n.test(lc)) score--
  if (score > 0) return 'positive'
  if (score < 0) return 'negative'
  if (/neutral/.test(lc)) return 'neutral'
  return 'mixed'
}

export interface AggregatedResults {
  totalReports: number
  competitorCounts: Record<string, number>
  competitorPercentages: Record<string, number>
  pricingSentimentCounts: Record<string, number>
  pricingPercentages: Record<string, number>
  trendByDate: Record<string, number>
}

export async function aggregateReports(storageDir: string): Promise<AggregatedResults> {
  const clientDirs = await getClientFolders(storageDir)
  const competitorCounts: Record<string, number> = {}
  const pricingSentimentCounts: Record<string, number> = {}
  const trendByDate: Record<string, number> = {}
  let totalReports = 0

  for (const clientDir of clientDirs) {
    const reports = await fs.readdir(clientDir, { withFileTypes: true })
    for (const rep of reports) {
      if (!rep.isDirectory()) continue
      const repDir = path.join(clientDir, rep.name)
      const summary = await parseReport(repDir)
      if (!summary) continue
      totalReports++
      if (summary.competitor) {
        competitorCounts[summary.competitor] = (competitorCounts[summary.competitor] || 0) + 1
      }
      if (summary.pricingSentiment) {
        pricingSentimentCounts[summary.pricingSentiment] = (pricingSentimentCounts[summary.pricingSentiment] || 0) + 1
      }
      const dateKey = summary.timestamp ? new Date(summary.timestamp).toISOString().slice(0, 10) : 'unknown'
      trendByDate[dateKey] = (trendByDate[dateKey] || 0) + 1
    }
  }

  const competitorPercentages: Record<string, number> = {}
  for (const [name, count] of Object.entries(competitorCounts)) {
    competitorPercentages[name] = (count / totalReports) * 100
  }
  const pricingPercentages: Record<string, number> = {}
  for (const [sent, count] of Object.entries(pricingSentimentCounts)) {
    pricingPercentages[sent] = (count / totalReports) * 100
  }

  return {
    totalReports,
    competitorCounts,
    competitorPercentages,
    pricingSentimentCounts,
    pricingPercentages,
    trendByDate,
  }
}
