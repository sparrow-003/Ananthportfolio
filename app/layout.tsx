import type React from "react"
import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import "./dark-theme.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Ananth N. - Elite AI Developer | Premium LLM & Agent Specialist",
  description:
    "🚀 Elite AI Developer specializing in cutting-edge LLM integrations, autonomous agents, LangChain, LangGraph, and premium full-stack solutions. Available for high-value projects.",
  keywords:
    "Elite AI Developer, LLM Expert, LangChain, LangGraph, AI Agents, OpenAI GPT, Claude API, Web Scraping, Premium Developer, Full-Stack AI",
  authors: [{ name: "Ananth N." }],
  creator: "Ananth N.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ananthn.dev",
    title: "Ananth N. - Elite AI Developer | Premium LLM & Agent Specialist",
    description:
      "🚀 Elite AI Developer specializing in cutting-edge LLM integrations, autonomous agents, and premium solutions.",
    siteName: "Ananth N. - Elite Portfolio",
    images: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1740320840665.jpg-VKDMFI4IGCGNUXiKNfHjD5HVdlnfyx.jpeg",
        width: 1200,
        height: 630,
        alt: "Ananth N. - Elite AI Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ananth N. - Elite AI Developer",
    description: "🚀 Elite AI Developer specializing in LLM integrations and autonomous agents",
    creator: "@ananthn",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1740320840665.jpg-VKDMFI4IGCGNUXiKNfHjD5HVdlnfyx.jpeg",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable}`}>
      <head>
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  )
}
