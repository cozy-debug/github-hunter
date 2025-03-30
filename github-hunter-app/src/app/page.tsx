'use client'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'

interface ResultItem {
  repo_name: string
  created_at: string
  star_count: number
  current_star_count: number
  score: number
  deepseek_analysis: string
  summary: string
  readme?: string
}

export default function Home() {
  const [data, setData] = useState<ResultItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/results')
        const jsonData = await response.json()
     
        setData(jsonData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
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
          {data.map((item, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">
                  {item.repo_name || 'Repository'}
                </CardTitle>
                {item.created_at && (
                  <CardDescription>
                    Created {formatDistanceToNow(new Date(item.created_at))} ago
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium">评分:</span>
                    <span className="font-bold text-lg">
                      {item.score}/10
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">近期Star数:</span>
                    <span>{item.star_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">总Star数:</span>
                    <span>{item.current_star_count}</span>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">简介:</h3>
                    <p className="text-sm text-gray-600">
                      {item.summary}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
