import fs from 'fs-extra'
import path from 'path'
import { getClientFolders, parseReport } from './analysis'

export interface MetricResult {
  total: number
  counts: Record<string, number>
  percentages: Record<string, number>
}

const lossKeywords: Record<string, RegExp[]> = {
  pricing: [/price/, /cost/],
  relationships: [/relationship/, /network/],
  expertise: [/expertise/, /experience/, /knowledge/],
  technology: [/technology/, /platform/, /integration/],
  analytics: [/analytic/, /data/],
  speed: [/turnaround/, /speed/],
  methodology: [/methodology/, /approach/],
  security: [/security/, /clearance/]
}

function categorize(text: string, keywords: Record<string, RegExp[]>): string[] {
  const lc = text.toLowerCase()
  const cats: string[] = []
  for (const [cat, patterns] of Object.entries(keywords)) {
    if (patterns.some((p) => p.test(lc))) cats.push(cat)
  }
  if (!cats.length) cats.push('other')
  return cats
}

export async function computeLossFactors(storageDir: string, client?: string): Promise<MetricResult> {
  const clientDirs = await getClientFolders(storageDir)
  const counts: Record<string, number> = {}
  let total = 0

  for (const dir of clientDirs) {
    const reports = await fs.readdir(dir, { withFileTypes: true })
    for (const rep of reports) {
      if (!rep.isDirectory()) continue
      const repDir = path.join(dir, rep.name)
      const summary = await parseReport(repDir)
      if (!summary || (client && summary.client !== client)) continue
      if (summary.notes) {
        total++
        for (const cat of categorize(summary.notes, lossKeywords)) {
          counts[cat] = (counts[cat] || 0) + 1
        }
      }
    }
  }

  const percentages: Record<string, number> = {}
  for (const [cat, count] of Object.entries(counts)) {
    percentages[cat] = total ? (count / total) * 100 : 0
  }

  return { total, counts, percentages }
}

export async function computeCompetitorPositioning(storageDir: string, client?: string): Promise<MetricResult> {
  const clientDirs = await getClientFolders(storageDir)
  const counts: Record<string, number> = {}
  let total = 0

  for (const dir of clientDirs) {
    const reports = await fs.readdir(dir, { withFileTypes: true })
    for (const rep of reports) {
      if (!rep.isDirectory()) continue
      const repDir = path.join(dir, rep.name)
      const summary = await parseReport(repDir)
      if (!summary || (client && summary.client !== client)) continue
      if (summary.competitor) {
        total++
        counts[summary.competitor] = (counts[summary.competitor] || 0) + 1
      }
    }
  }

  const percentages: Record<string, number> = {}
  for (const [cat, count] of Object.entries(counts)) {
    percentages[cat] = total ? (count / total) * 100 : 0
  }

  return { total, counts, percentages }
}

const gapKeywords: Record<string, RegExp[]> = {
  technology: [/technology/, /platform/, /implementation/],
  expertise: [/expertise/, /experience/, /knowledge/],
  analytics: [/analytic/, /data/, /benchmark/],
  methodology: [/methodology/, /approach/],
  security: [/security/, /clearance/],
  relationships: [/relationship/, /network/]
}

export async function computeGapAnalysis(storageDir: string, client?: string): Promise<MetricResult> {
  const clientDirs = await getClientFolders(storageDir)
  const counts: Record<string, number> = {}
  let total = 0

  for (const dir of clientDirs) {
    const reports = await fs.readdir(dir, { withFileTypes: true })
    for (const rep of reports) {
      if (!rep.isDirectory()) continue
      const repDir = path.join(dir, rep.name)
      const summary = await parseReport(repDir)
      if (!summary || (client && summary.client !== client)) continue
      for (const qa of summary.qa) {
        if (/gap/.test(qa.question.toLowerCase())) {
          total++
          for (const cat of categorize(qa.answer, gapKeywords)) {
            counts[cat] = (counts[cat] || 0) + 1
          }
        }
      }
    }
  }

  const percentages: Record<string, number> = {}
  for (const [cat, count] of Object.entries(counts)) {
    percentages[cat] = total ? (count / total) * 100 : 0
  }

  return { total, counts, percentages }
}

export async function computeTrends(storageDir: string, client?: string): Promise<Record<string, number>> {
  const clientDirs = await getClientFolders(storageDir)
  const trend: Record<string, number> = {}

  for (const dir of clientDirs) {
    const reports = await fs.readdir(dir, { withFileTypes: true })
    for (const rep of reports) {
      if (!rep.isDirectory()) continue
      const repDir = path.join(dir, rep.name)
      const summary = await parseReport(repDir)
      if (!summary || (client && summary.client !== client)) continue
      const dateKey = summary.timestamp ? new Date(summary.timestamp).toISOString().slice(0, 10) : 'unknown'
      trend[dateKey] = (trend[dateKey] || 0) + 1
    }
  }

  return trend
}

