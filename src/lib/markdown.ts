import DOMPurify from 'dompurify'

// Configure DOMPurify to allow safe HTML elements and attributes
const purifyConfig = {
  ALLOWED_TAGS: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr',
    'ul', 'ol', 'li',
    'strong', 'em', 'b', 'i', 'u', 's', 'del',
    'blockquote', 'pre', 'code',
    'a', 'img',
    'span', 'div', 'figure', 'figcaption',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'sup', 'sub', 'mark', 'input', 'label'
  ],
  ALLOWED_ATTR: [
    'class', 'href', 'src', 'alt', 'title', 'target', 'rel', 'loading',
    'colspan', 'rowspan', 'style', 'type', 'checked', 'disabled'
  ],
  ALLOW_DATA_ATTR: false,
}

interface CodeBlock {
  lang: string
  code: string
}

interface DiagramBlock {
  type: string
  content: string
}

// Simple markdown parser with XSS protection
export const parseMarkdown = (markdown: string): string => {
  // Normalize line endings
  let text = markdown.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  
  // Store code blocks and diagrams to protect them
  const codeBlocks: CodeBlock[] = []
  const diagramBlocks: DiagramBlock[] = []
  const inlineCodes: string[] = []

  // Extract diagram blocks first
  text = text.replace(/```(mermaid|diagram|ascii|chart|flow|plantuml)\n([\s\S]*?)```/g, (match, type, content) => {
    const index = diagramBlocks.length
    diagramBlocks.push({ type, content: content.trim() })
    return `\u0000DIAGRAM${index}\u0000`
  })

  // Extract code blocks
  text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    const index = codeBlocks.length
    codeBlocks.push({ lang: lang || '', code: code.trim() })
    return `\u0000CODE${index}\u0000`
  })

  // Extract inline code
  text = text.replace(/`([^`]+)`/g, (match, code) => {
    const index = inlineCodes.length
    inlineCodes.push(code)
    return `\u0000INLINE${index}\u0000`
  })

  // Split into blocks separated by blank lines
  // This groups consecutive non-empty lines into single paragraphs
  const blocks = text.split(/\n{2,}/)
  const htmlBlocks: string[] = []

  for (const block of blocks) {
    const trimmedBlock = block.trim()
    if (!trimmedBlock) continue

    // Check for special placeholders
    if (trimmedBlock.startsWith('\u0000')) {
      htmlBlocks.push(trimmedBlock)
      continue
    }

    const lines = trimmedBlock.split('\n')
    
    // Check if entire block is a table
    if (lines.length >= 3 && lines[0].trim().startsWith('|') && lines[0].trim().endsWith('|')) {
      const allTable = lines.every(l => l.trim().startsWith('|') && l.trim().endsWith('|'))
      if (allTable) {
        htmlBlocks.push(parseTable(lines.map(l => l.trim())))
        continue
      }
    }

    // Process line by line within the block
    const blockHtml: string[] = []
    let inList = false
    let listType: 'ul' | 'ol' | null = null
    let listItems: string[] = []

    const flushList = () => {
      if (listItems.length > 0) {
        const listTag = listType === 'ol' ? 'ol' : 'ul'
        const className = listType === 'ol' ? 'blog-list' : 'blog-checklist'
        blockHtml.push(`<${listTag} class="${className}">${listItems.join('')}</${listTag}>`)
        listItems = []
        inList = false
        listType = null
      }
    }

    // Collect consecutive paragraph lines
    const paragraphLines: string[] = []

    const flushParagraph = () => {
      if (paragraphLines.length > 0) {
        flushList()
        const combined = paragraphLines.map(l => parseInline(l)).join(' ')
        blockHtml.push(`<p class="blog-paragraph">${combined}</p>`)
        paragraphLines.length = 0
      }
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmedLine = line.trim()

      if (trimmedLine === '') {
        flushParagraph()
        flushList()
        continue
      }

      // Check for special placeholders
      if (trimmedLine.startsWith('\u0000')) {
        flushParagraph()
        flushList()
        blockHtml.push(trimmedLine)
        continue
      }

      // Headers
      const headerMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/)
      if (headerMatch) {
        flushParagraph()
        flushList()
        const level = headerMatch[1].length
        const content = parseInline(headerMatch[2])
        blockHtml.push(`<h${level} class="blog-h${level}">${content}</h${level}>`)
        continue
      }

      // Horizontal rule
      if (/^([-*_])\s*\1\s*\1+$/.test(trimmedLine)) {
        flushParagraph()
        flushList()
        blockHtml.push('<hr class="blog-hr" />')
        continue
      }

      // Blockquote
      if (trimmedLine.startsWith('>')) {
        flushParagraph()
        flushList()
        const content = parseInline(trimmedLine.slice(1).trim())
        blockHtml.push(`<blockquote class="blog-blockquote">${content}</blockquote>`)
        continue
      }

      // Checklist items
      const checkedItemMatch = trimmedLine.match(/^- \[x\]\s+(.+)$/)
      const uncheckedItemMatch = trimmedLine.match(/^- \[ \]\s+(.+)$/)
      if (checkedItemMatch || uncheckedItemMatch) {
        flushParagraph()
        const content = checkedItemMatch ? checkedItemMatch[1] : uncheckedItemMatch![1]
        const isChecked = !!checkedItemMatch
        listItems.push(`<li class="checklist-item"><span class="blog-check${isChecked ? ' checked' : ''}">${isChecked ? '✓' : ''}</span> ${parseInline(content)}</li>`)
        inList = true
        listType = 'ul'
        continue
      }

      // Unordered list
      const ulMatch = trimmedLine.match(/^[-*+]\s+(.+)$/)
      if (ulMatch) {
        flushParagraph()
        if (inList && listType !== 'ul') flushList()
        listItems.push(`<li>${parseInline(ulMatch[1])}</li>`)
        inList = true
        listType = 'ul'
        continue
      }

      // Ordered list
      const olMatch = trimmedLine.match(/^\d+\.\s+(.+)$/)
      if (olMatch) {
        flushParagraph()
        if (inList && listType !== 'ol') flushList()
        listItems.push(`<li>${parseInline(olMatch[1])}</li>`)
        inList = true
        listType = 'ol'
        continue
      }

      // If we're in a list, flush it before starting paragraph content
      if (inList) {
        flushList()
      }

      // Regular text line - accumulate for paragraph
      if (!trimmedLine.startsWith('<')) {
        paragraphLines.push(trimmedLine)
      } else {
        flushParagraph()
        blockHtml.push(trimmedLine)
      }
    }

    flushParagraph()
    flushList()

    htmlBlocks.push(blockHtml.join(''))
  }

  // Join all HTML blocks
  let html = htmlBlocks.join('')

  // Restore inline codes
  inlineCodes.forEach((code, index) => {
    html = html.replace(`\u0000INLINE${index}\u0000`, `<code class="blog-inline-code">${escapeHtml(code)}</code>`)
  })

  // Restore code blocks
  codeBlocks.forEach((block, index) => {
    const langLabel = block.lang ? `<div class="blog-code-lang">${escapeHtml(block.lang.toUpperCase())}</div>` : ''
    const highlighted = highlightCode(block.code, block.lang || 'plaintext')
    html = html.replace(`\u0000CODE${index}\u0000`, `<div class="blog-code-wrapper">${langLabel}<pre class="blog-code-block"><code class="blog-code">${highlighted}</code></pre></div>`)
  })

  // Restore diagram blocks
  diagramBlocks.forEach((block, index) => {
    const label = `<div class="blog-diagram-label">${escapeHtml(block.type)}</div>`
    html = html.replace(`\u0000DIAGRAM${index}\u0000`, `<div class="blog-diagram-wrapper" style="position:relative;margin:1em 0">${label}<div class="blog-diagram">${escapeHtml(block.content)}</div></div>`)
  })

  // Clean up empty paragraphs
  html = html.replace(/<p class="blog-paragraph">\s*<\/p>/g, '')

  // CRITICAL: Sanitize the final HTML output to prevent XSS
  return DOMPurify.sanitize(html, purifyConfig)
}

// Parse table lines
const parseTable = (lines: string[]): string => {
  if (lines.length < 3) return ''

  const headerCells = lines[0].split('|').filter(c => c.trim() !== '').map(c => c.trim())
  const alignCells = lines[1].split('|').filter(c => c.trim() !== '').map(c => c.trim())
  const dataLines = lines.slice(2)

  const alignments = alignCells.map(cell => {
    if (cell.startsWith(':') && cell.endsWith(':')) return 'center'
    if (cell.endsWith(':')) return 'right'
    return 'left'
  })

  let html = '<div class="blog-table-wrapper"><table class="blog-table"><thead><tr>'
  headerCells.forEach((h, i) => {
    html += `<th style="text-align:${alignments[i] || 'left'}">${parseInline(h)}</th>`
  })
  html += '</tr></thead><tbody>'

  dataLines.forEach(rowLine => {
    const cells = rowLine.split('|').filter(c => c.trim() !== '').map(c => c.trim())
    if (cells.length > 0) {
      html += '<tr>'
      cells.forEach((cell, i) => {
        html += `<td style="text-align:${alignments[i] || 'left'}">${parseInline(cell)}</td>`
      })
      html += '</tr>'
    }
  })

  html += '</tbody></table></div>'
  return html
}

// Parse inline markdown
const parseInline = (text: string): string => {
  let result = escapeHtml(text)

  // Bold and italic
  result = result.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
  result = result.replace(/___(.*?)___/g, '<strong><em>$1</em></strong>')
  result = result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  result = result.replace(/\*(.*?)\*/g, '<em>$1</em>')

  // Strikethrough
  result = result.replace(/~~(.*?)~~/g, '<del>$1</del>')

  // Highlight
  result = result.replace(/==(.*?)==/g, '<mark>$1</mark>')

  // Links
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
    const safeUrl = sanitizeUrl(url)
    return `<a href="${safeUrl}" class="blog-link" target="_blank" rel="noopener noreferrer">${text}</a>`
  })

  // Images
  result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
    const safeSrc = sanitizeUrl(src)
    const safeAlt = escapeHtml(alt)
    return `<figure class="blog-image-figure"><img src="${safeSrc}" alt="${safeAlt}" class="blog-content-image" loading="lazy" />${safeAlt ? `<figcaption class="blog-image-caption">${safeAlt}</figcaption>` : ''}</figure>`
  })

  return result
}

// Escape HTML entities
const escapeHtml = (text: string): string => {
  const htmlEntities: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }
  return text.replace(/[&<>"']/g, char => htmlEntities[char] || char)
}

// Sanitize URLs
const sanitizeUrl = (url: string): string => {
  const trimmedUrl = url.trim().toLowerCase()

  if (trimmedUrl.startsWith('javascript:') || trimmedUrl.startsWith('data:') || trimmedUrl.startsWith('vbscript:')) {
    return '#'
  }

  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://') || trimmedUrl.startsWith('mailto:') || trimmedUrl.startsWith('tel:') || trimmedUrl.startsWith('/') || trimmedUrl.startsWith('#') || !trimmedUrl.includes(':')) {
    return url
  }

  return '#'
}

// Simple syntax highlighting
export const highlightCode = (code: string, language: string): string => {
  const keywords: { [key: string]: string[] } = {
    javascript: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export', 'async', 'await', 'try', 'catch'],
    typescript: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export', 'interface', 'type', 'async', 'await', 'try', 'catch'],
    python: ['def', 'class', 'if', 'else', 'elif', 'for', 'while', 'return', 'import', 'from', 'try', 'except', 'with', 'as', 'lambda', 'yield'],
    css: ['color', 'background', 'margin', 'padding', 'border', 'width', 'height', 'display', 'position', 'flex', 'grid'],
    html: ['div', 'span', 'p', 'h1', 'h2', 'h3', 'body', 'head', 'html', 'script', 'style', 'section', 'article'],
    sql: ['SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP', 'JOIN', 'ON', 'AND', 'OR', 'NOT', 'NULL', 'TABLE', 'INDEX'],
    java: ['public', 'private', 'protected', 'class', 'interface', 'extends', 'implements', 'void', 'int', 'String', 'return', 'new', 'static', 'final'],
    rust: ['fn', 'let', 'mut', 'pub', 'struct', 'impl', 'enum', 'match', 'if', 'else', 'for', 'while', 'return', 'use', 'mod'],
  }

  let highlighted = escapeHtml(code)

  if (keywords[language]) {
    keywords[language].forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g')
      highlighted = highlighted.replace(regex, `<span style="color: hsl(var(--primary)); font-weight: 600;">${keyword}</span>`)
    })
  }

  highlighted = highlighted.replace(/(["'])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span style="color: hsl(199, 89%, 60%);">$1$2$3</span>')
  highlighted = highlighted.replace(/(\/\/.*$)/gm, '<span style="color: hsl(var(--muted-foreground)); font-style: italic;">$1</span>')
  highlighted = highlighted.replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color: hsl(var(--muted-foreground)); font-style: italic;">$1</span>')

  return DOMPurify.sanitize(highlighted, purifyConfig)
}
