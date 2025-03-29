import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com'
})

async function analyzeRepo(repoUrl: string) {
  // First call: Summarize README
  const summaryResponse = await openai.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      {
        role: 'system',
        content: 'Summarize the GitHub repository README in 3 bullet points'
      },
      {
        role: 'user',
        content: `Repository: ${repoUrl}`
      }
    ],
    stream: false
  })

  // Second call: Score the repo
  const scoreResponse = await openai.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      {
        role: 'system',
        content: 'Rate this GitHub repository from 1-10 based on quality, activity and usefulness'
      },
      {
        role: 'user',
        content: `Repository: ${repoUrl}`
      }
    ],
    stream: false
  })

  return {
    summary: summaryResponse.choices[0].message.content,
    score: scoreResponse.choices[0].message.content
  }
}

export async function POST() {
  try {
    // Read result.csv
    const csvPath = path.join(process.cwd(), 'public', 'result.csv')
    const csvData = fs.readFileSync(csvPath, 'utf8')
    
    // Parse CSV
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true
    })

    // Process top 10 repos (for demo)
    const topRepos = records.slice(0, 10)
    const results = []

    for (const repo of topRepos) {
      const repoUrl = `https://github.com/${repo.repo_name}`
      const analysis = await analyzeRepo(repoUrl)
      
      results.push({
        repo_name: repo.repo_name,
        stars: repo.current_star_count,
        created_at: repo.created_at,
        ...analysis
      })
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error('Error processing CSV:', error)
    return NextResponse.json(
      { error: 'Failed to process repositories' },
      { status: 500 }
    )
  }
}
