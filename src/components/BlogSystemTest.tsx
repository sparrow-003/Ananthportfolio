import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Loader2, Database, Users, Heart, MessageSquare } from 'lucide-react'
import { blogAPI, supabase } from '@/lib/supabase'
import { getUserIP } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface TestResult {
  name: string
  status: 'pending' | 'success' | 'error'
  message: string
  icon: React.ElementType
}

export const BlogSystemTest = () => {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Database Connection', status: 'pending', message: 'Testing...', icon: Database },
    { name: 'Fetch Posts', status: 'pending', message: 'Testing...', icon: MessageSquare },
    { name: 'User IP Detection', status: 'pending', message: 'Testing...', icon: Users },
    { name: 'Like System', status: 'pending', message: 'Testing...', icon: Heart },
  ])
  const [isRunning, setIsRunning] = useState(false)

  const updateTest = (index: number, status: TestResult['status'], message: string) => {
    setTests(prev => prev.map((test, i) => 
      i === index ? { ...test, status, message } : test
    ))
  }

  const runTests = async () => {
    setIsRunning(true)
    
    try {
      // Test 1: Database Connection
      updateTest(0, 'pending', 'Connecting to Supabase...')
      const { data, error } = await supabase.from('blog_posts').select('count').limit(1)
      if (error) {
        updateTest(0, 'error', `Connection failed: ${error.message}`)
      } else {
        updateTest(0, 'success', 'Connected successfully')
      }

      // Test 2: Fetch Posts
      updateTest(1, 'pending', 'Fetching blog posts...')
      try {
        const posts = await blogAPI.getPosts()
        updateTest(1, 'success', `Found ${posts.length} published posts`)
      } catch (error: any) {
        updateTest(1, 'error', `Failed to fetch posts: ${error.message}`)
      }

      // Test 3: User IP Detection
      updateTest(2, 'pending', 'Getting user identifier...')
      try {
        const userIP = await getUserIP()
        updateTest(2, 'success', `User ID: ${userIP.substring(0, 8)}...`)
      } catch (error: any) {
        updateTest(2, 'error', `IP detection failed: ${error.message}`)
      }

      // Test 4: Like System (if posts exist)
      updateTest(3, 'pending', 'Testing like functionality...')
      try {
        const posts = await blogAPI.getPosts()
        if (posts.length > 0) {
          const userIP = await getUserIP()
          const hasLiked = await blogAPI.hasUserLiked(posts[0].id, userIP)
          updateTest(3, 'success', `Like system working (liked: ${hasLiked})`)
        } else {
          updateTest(3, 'error', 'No posts available to test likes')
        }
      } catch (error: any) {
        updateTest(3, 'error', `Like test failed: ${error.message}`)
      }

    } catch (error: any) {
      toast.error(`Test suite failed: ${error.message}`)
    } finally {
      setIsRunning(false)
    }
  }

  const createSamplePost = async () => {
    try {
      const samplePost = {
        title: 'Test Blog Post',
        content: `# Test Blog Post

This is a **test blog post** created by the system test.

## Features Tested

- Blog post creation
- Markdown rendering
- Database integration
- Real-time updates

## Code Example

\`\`\`javascript
const message = "Hello, World!";
console.log(message);
\`\`\`

This post can be safely deleted from the admin panel.`,
        excerpt: 'A test blog post created to verify the blog system is working correctly.',
        slug: `test-post-${Date.now()}`,
        published: true,
        author_name: 'System Test',
        tags: ['test', 'system', 'verification'],
        allow_comments: true
      }

      await blogAPI.createPost(samplePost)
      toast.success('Sample post created successfully!')
      
      // Re-run tests to verify
      setTimeout(runTests, 1000)
    } catch (error: any) {
      toast.error(`Failed to create sample post: ${error.message}`)
    }
  }

  useEffect(() => {
    runTests()
  }, [])

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
    }
  }

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">Passed</Badge>
      case 'error':
        return <Badge variant="secondary" className="bg-red-500/10 text-red-500 border-red-500/20">Failed</Badge>
      default:
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Running</Badge>
    }
  }

  const allTestsPassed = tests.every(test => test.status === 'success')
  const hasErrors = tests.some(test => test.status === 'error')

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 pt-24 min-h-screen">
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-primary" />
            Blog System Test Suite
          </CardTitle>
          <p className="text-muted-foreground">
            Verify that all blog system components are working correctly
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {tests.map((test, index) => (
            <motion.div
              key={test.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-muted/20"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(test.status)}
                <div>
                  <h4 className="font-medium text-foreground">{test.name}</h4>
                  <p className="text-sm text-muted-foreground">{test.message}</p>
                </div>
              </div>
              {getStatusBadge(test.status)}
            </motion.div>
          ))}

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/50">
            <Button 
              onClick={runTests} 
              disabled={isRunning}
              className="flex-1"
            >
              {isRunning ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Run Tests Again
            </Button>
            
            <Button 
              onClick={createSamplePost}
              variant="outline"
              className="flex-1"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Create Sample Post
            </Button>
          </div>

          {allTestsPassed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">All tests passed! Your blog system is working correctly.</span>
              </div>
            </motion.div>
          )}

          {hasErrors && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500"
            >
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                <span className="font-medium">Some tests failed. Please check the setup guide.</span>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default BlogSystemTest