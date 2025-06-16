import { NextResponse } from 'next/server'
import path from 'path'
import { computeTrends } from '@/lib/analysis-utils'

export async function GET(request: Request) {
  try {
    const storageDir = path.join(process.cwd(), 'storage')
    const url = new URL(request.url)
    const client = url.searchParams.get('client') || undefined
    const data = await computeTrends(storageDir, client)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error computing trends:', error)
    const msg = error instanceof Error ? error.message : 'An unknown error occurred'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
