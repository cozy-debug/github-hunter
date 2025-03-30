'use client'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
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
        <NavigationMenu className="mb-8 mx-auto">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink 
                href="https://github.com/chmod777john/github-hunter" 
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "text-lg font-medium hover:text-blue-600",
                  navigationMenuTriggerStyle(),
                  "text-[1.1rem]"
                )}>
                项目源码
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-lg font-medium hover:text-blue-600">
                工作原理
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 w-[300px]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <div className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">

                        <p className="text-sm leading-tight text-muted-foreground">
                          我们通过 GitHub API 监听最近 48 小时内的活动事件，包括所有账号的点赞事件。有潜力的种子项目 star 总数未必很多，但这是因为其创建时间短。我们的目标就是找到这些创建不久但增速快的项目。
                        </p>

                      </div>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-lg font-medium hover:text-blue-600">
                创投研交流群
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 w-[300px]">
                  <li>
                    <NavigationMenuLink asChild>
                      <div className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        
                        <div className="w-32 h-32 flex items-center justify-center mt-2">
                          <img src="/image.png" alt="交流群二维码" className="w-full h-full object-contain" />
                        </div>
                      </div>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">GitHub Hunter</h1>
        <p className="text-lg text-gray-600 mb-4">
          监听 48 小时内的 GitHub 活动事件，绝不漏掉任何一个种子项目
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
                  <a 
                    href={`https://github.com/${item.repo_name}`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {item.repo_name || 'Repository'}
                  </a>
                </CardTitle>
                {item.created_at && (
                  <CardDescription>
                    Created at {formatDistanceToNow(new Date(item.created_at))} ago
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium">AI 打分:</span>
                    <span className="font-bold text-lg">
                      {item.score}/10
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">48小时内Star数:</span>
                    <span>{item.star_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">历史总Star数:</span>
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
