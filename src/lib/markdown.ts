import DOMPurify from 'dompurify'

// Configure DOMPurify to allow safe HTML elements and attributes
const purifyConfig = {
  ALLOWED_TAGS: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr',
    'ul', 'ol', 'li',
    'strong', 'em', 'b', 'i', 'u', 's',
    'blockquote', 'pre', 'code',
    'a', 'img',
    'span', 'div'
  ],
  ALLOWED_ATTR: [
    'class', 'href', 'src', 'alt', 'title', 'target', 'rel', 'loading'
  ],
  ALLOW_DATA_ATTR: false,
}

// Simple markdown parser with XSS protection
export const parseMarkdown = (markdown: string): string => {
  let html = markdown

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-light mb-2 mt-4">$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-light mb-3 mt-6">$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-light mb-4 mt-8">$1</h1>')

  // Bold and Italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
  html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')

  // Code blocks - escape content first
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre class="bg-gray-900 border border-emerald-500/20 rounded-lg p-4 overflow-x-auto my-4"><code class="text-gray-300 text-sm font-mono">${escapeHtml(code.trim())}</code></pre>`
  })

  // Inline code - escape content
  html = html.replace(/`([^`]+)`/g, (match, code) => {
    return `<code class="bg-emerald-500/20 text-emerald-400 px-1 py-0.5 rounded text-sm font-mono">${escapeHtml(code)}</code>`
  })

  // Links - sanitize href
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
    const safeUrl = sanitizeUrl(url)
    const safeText = escapeHtml(text)
    return `<a href="${safeUrl}" class="text-emerald-500 hover:text-emerald-400 underline" target="_blank" rel="noopener noreferrer">${safeText}</a>`
  })

  // Images - sanitize src
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
    const safeSrc = sanitizeUrl(src)
    const safeAlt = escapeHtml(alt)
    return `<img src="${safeSrc}" alt="${safeAlt}" class="rounded-lg my-4 max-w-full h-auto" loading="lazy" />`
  })

  // Lists
  html = html.replace(/^\* (.+)$/gm, '<li class="mb-1">$1</li>')
  html = html.replace(/^(\d+)\. (.+)$/gm, '<li class="mb-1">$2</li>')

  // Wrap consecutive list items in ul/ol
  html = html.replace(/(<li class="mb-1">.*<\/li>\s*)+/gs, (match) => {
    return `<ul class="list-disc list-inside text-gray-300 mb-4 space-y-1">${match}</ul>`
  })

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-emerald-500 pl-4 italic text-gray-300 my-4 bg-emerald-500/5 p-4 rounded-r-lg">$1</blockquote>')

  // Paragraphs
  html = html.replace(/^(?!<[h|u|b|p|l|i])(.*$)/gm, '<p class="text-gray-300 mb-4 leading-relaxed">$1</p>')

  // Line breaks
  html = html.replace(/\n/g, '<br>')

  // Clean up empty paragraphs
  html = html.replace(/<p class="text-gray-300 mb-4 leading-relaxed"><\/p>/g, '')
  html = html.replace(/<p class="text-gray-300 mb-4 leading-relaxed"><br><\/p>/g, '')

  // CRITICAL: Sanitize the final HTML output to prevent XSS
  return DOMPurify.sanitize(html, purifyConfig)
}

// Escape HTML entities to prevent injection
const escapeHtml = (text: string): string => {
  const htmlEntities: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char] || char)
}

// Sanitize URLs to prevent javascript: and data: URLs
const sanitizeUrl = (url: string): string => {
  const trimmedUrl = url.trim().toLowerCase()
  
  // Block dangerous protocols
  if (
    trimmedUrl.startsWith('javascript:') ||
    trimmedUrl.startsWith('data:') ||
    trimmedUrl.startsWith('vbscript:')
  ) {
    return '#'
  }
  
  // Allow http, https, mailto, tel, and relative URLs
  if (
    trimmedUrl.startsWith('http://') ||
    trimmedUrl.startsWith('https://') ||
    trimmedUrl.startsWith('mailto:') ||
    trimmedUrl.startsWith('tel:') ||
    trimmedUrl.startsWith('/') ||
    trimmedUrl.startsWith('#') ||
    !trimmedUrl.includes(':')
  ) {
    return url
  }
  
  return '#'
}

// Simple syntax highlighting for common languages
export const highlightCode = (code: string, language: string): string => {
  const keywords: { [key: string]: string[] } = {
    javascript: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export'],
    typescript: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export', 'interface', 'type'],
    python: ['def', 'class', 'if', 'else', 'for', 'while', 'return', 'import', 'from', 'try', 'except'],
    css: ['color', 'background', 'margin', 'padding', 'border', 'width', 'height', 'display', 'position'],
    html: ['div', 'span', 'p', 'h1', 'h2', 'h3', 'body', 'head', 'html', 'script', 'style']
  }

  let highlighted = escapeHtml(code)

  if (keywords[language]) {
    keywords[language].forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g')
      highlighted = highlighted.replace(regex, `<span class="text-emerald-400 font-semibold">${keyword}</span>`)
    })
  }

  // Highlight strings
  highlighted = highlighted.replace(/(["'])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span class="text-teal-400">$1$2$3</span>')

  // Highlight comments
  highlighted = highlighted.replace(/(\/\/.*$)/gm, '<span class="text-gray-500 italic">$1</span>')
  highlighted = highlighted.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-gray-500 italic">$1</span>')

  return DOMPurify.sanitize(highlighted, purifyConfig)
}
