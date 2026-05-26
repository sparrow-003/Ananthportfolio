import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { BlogPost as BlogPostType, isSupabaseConfigured } from '@/lib/supabase'

interface CliTerminalProps {
  posts: BlogPostType[]
  comments: { id: string; author: string; content: string }[]
  onEditPost: (post: BlogPostType) => void
  onPublishPost: (id: string) => Promise<void>
  onDeletePost: (id: string) => Promise<void>
  onRefresh: () => Promise<void>
  onExitCli: () => void
}

export const CliTerminal = ({
  posts,
  comments,
  onEditPost,
  onPublishPost,
  onDeletePost,
  onRefresh,
  onExitCli
}: CliTerminalProps) => {
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '> Genesis System v4.2.0 initialized...',
    '> Type "help" for available commands.'
  ])
  const [terminalInput, setTerminalInput] = useState('')
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalOutput])

  const addOutput = useCallback((lines: string | string[]) => {
    setTerminalOutput(prev => [...prev, ...(Array.isArray(lines) ? lines : [lines])])
  }, [])

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault()
    const cmd = terminalInput.trim().toLowerCase()
    if (!cmd) return

    if (cmd === 'clear') {
      setTerminalOutput([])
      setTerminalInput('')
      return
    }

    addOutput(`$ ${terminalInput}`)
    setTerminalInput('')

    const args = cmd.split(' ')
    const command = args[0]

    switch (command) {
      case 'help':
        addOutput([
          '> Available commands:',
          '  list               - List all blog posts',
          '  stats              - Show analytics summary',
          '  status             - Show system status',
          '  edit <id>          - Open post in editor',
          '  publish <id>       - Publish a post',
          '  delete <id>        - Delete a post',
          '  refresh            - Refresh data',
          '  clear              - Clear terminal',
          '  gui                - Switch to Dashboard',
          '  exit               - Exit CLI mode'
        ])
        break
      case 'list':
        if (posts.length === 0) addOutput('> No posts found.')
        else {
          addOutput(['> ID | TITLE | STATUS | VIEWS', '> --------------------------------'])
          posts.forEach(p => addOutput(`  ${p.id.substring(0, 8)}... | ${p.title.substring(0, 15)}... | ${p.published ? 'LIVE' : 'DRAFT'} | ${p.views_count}`))
        }
        break
      case 'stats':
        const totalViews = posts.reduce((acc, p) => acc + p.views_count, 0)
        addOutput([
          '> System Statistics:',
          `  Total Posts: ${posts.length}`,
          `  Total Views: ${totalViews}`,
          `  Total Comments: ${comments.length}`
        ])
        break
      case 'status':
        addOutput([
          `> System: Genesis v4.2.0`,
          `> Connection: ${isSupabaseConfigured ? 'Supabase Connected' : 'Mock Mode'}`,
          `> Posts Loaded: ${posts.length}`,
          `> Comments Loaded: ${comments.length}`
        ])
        break
      case 'refresh':
        addOutput('> Refreshing data...')
        try {
          await onRefresh()
          addOutput('> Data refreshed successfully')
        } catch {
          addOutput('> Error: Failed to refresh data')
        }
        break
      case 'gui':
      case 'exit':
        onExitCli()
        addOutput('> Switching to GUI...')
        break
      case 'edit':
        if (args[1]) {
          const post = posts.find(p => p.id.startsWith(args[1]) || p.id === args[1])
          if (post) {
            onEditPost(post)
            addOutput(`> Opening editor for "${post.title}"...`)
          } else addOutput(`> Error: Post "${args[1]}" not found.`)
        } else addOutput('> Usage: edit <id>')
        break
      case 'publish':
        if (args[1]) {
          const post = posts.find(p => p.id.startsWith(args[1]) || p.id === args[1])
          if (post && !post.published) {
            try {
              await onPublishPost(post.id)
              addOutput(`> Published "${post.title}"`)
            } catch {
              addOutput(`> Error: Failed to publish post`)
            }
          } else if (post?.published) {
            addOutput(`> Error: Post is already published`)
          } else {
            addOutput(`> Error: Post "${args[1]}" not found`)
          }
        } else addOutput('> Usage: publish <id>')
        break
      case 'delete':
        if (args[1]) {
          const post = posts.find(p => p.id.startsWith(args[1]) || p.id === args[1])
          if (post) {
            try {
              await onDeletePost(post.id)
              addOutput(`> Deleted "${post.title}"`)
            } catch {
              addOutput(`> Error: Failed to delete post`)
            }
          } else {
            addOutput(`> Error: Post "${args[1]}" not found`)
          }
        } else addOutput('> Usage: delete <id>')
        break
      default:
        addOutput(`> Command not found: ${command}`)
    }
  }

  return (
    <div
      className="min-h-screen bg-black text-green-500 font-mono p-4 flex flex-col"
      onClick={() => document.getElementById('cli-input')?.focus()}
    >
      <div className="flex justify-between items-center border-b border-green-900/50 pb-2 mb-2">
        <span>GENESIS TERMINAL v4.2.0</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onExitCli}
          className="text-green-500 hover:text-green-400 hover:bg-green-900/20"
        >
          Switch to GUI
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 pb-4" ref={terminalRef}>
        {terminalOutput.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap">{line}</div>
        ))}
      </div>
      <form onSubmit={handleCommand} className="flex gap-2 border-t border-green-900/50 pt-2">
        <span className="text-green-500 font-bold">{'>'}</span>
        <input
          id="cli-input"
          type="text"
          value={terminalInput}
          onChange={(e) => setTerminalInput(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-green-500 focus:ring-0"
          autoFocus
          autoComplete="off"
        />
      </form>
    </div>
  )
}
