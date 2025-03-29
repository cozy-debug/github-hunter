'use client'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'

interface Repo {
  repo_name: string
  star_count: number
  created_at: string
  current_star_count: number
}

export default function Home() {
  const [repos, setRepos] = useState<Repo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for styling
    const mockRepos = [
      {
        repo_name: "vercel/next.js",
        star_count: 423,
        created_at: "2023-01-15T10:00:00Z",
        current_star_count: 125000
      },
      {
        repo_name: "facebook/react",
        star_count: 389,
        created_at: "2022-12-20T08:30:00Z", 
        current_star_count: 218000
      },
      {
        repo_name: "vuejs/core",
        star_count: 256,
        created_at: "2023-02-10T14:15:00Z",
        current_star_count: 98000
      },
      {
        repo_name: "tailwindlabs/tailwindcss",
        star_count: 198,
        created_at: "2023-01-05T09:45:00Z",
        current_star_count: 75000
      },
      {
        repo_name: "microsoft/TypeScript",
        star_count: 175,
        created_at: "2022-11-30T16:20:00Z",
        current_star_count: 95000
      },
      {
        repo_name: "nodejs/node",
        star_count: 142,
        created_at: "2023-02-15T11:10:00Z",
        current_star_count: 100000
      }
    ]
    setRepos(mockRepos)
    setLoading(false)
  }, [])

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Github-24Hours</h1>
        <p className="text-lg text-gray-600">
          Trending repositories with most stars in last 24 hours
        </p>
      </div>
      
      {loading ? (
        <p className="text-center">Loading repositories...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repos.map((repo, index) => (
            <RepoCard key={index} repo={repo} />
          ))}
        </div>
      )}
    </div>
  )
}

function RepoCard({ repo }: { repo: Repo }) {
  const [owner, repoName] = repo.repo_name.includes('/') 
    ? repo.repo_name.split('/') 
    : ['unknown', repo.repo_name]
  const avatarUrl = `https://github.com/${owner}.png?size=60`

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4">
        <img 
          src={avatarUrl} 
          alt={`${owner} avatar`}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <CardTitle className="text-lg">
            <a 
              href={`https://github.com/${repo.repo_name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600"
            >
              {repo.repo_name}
            </a>
          </CardTitle>
          <CardDescription>
            Created {formatDistanceToNow(new Date(repo.created_at))} ago
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">24h Stars:</span>
            <span className="text-green-600 font-bold">+{repo.star_count}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Total Stars:</span>
            <span>{repo.current_star_count}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
