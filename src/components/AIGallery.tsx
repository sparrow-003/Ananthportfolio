import { memo, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReveal } from '@/hooks/useReveal';
import { Sparkles, Bot, Brain, Code2, Zap, ExternalLink } from 'lucide-react';

type Category = 'All' | 'Beginner' | 'Intermediate' | 'NLP' | 'Vision';

interface AIProject {
  id: number;
  title: string;
  description: string;
  category: Exclude<Category, 'All'>;
  difficulty: 'Beginner' | 'Intermediate';
  icon: React.ReactNode;
  tags: string[];
  snippet: string;
  language: string;
  thumbnail: string;
  demoUrl?: string;
}

const AI_PROJECTS: AIProject[] = [
  {
    id: 1,
    title: 'Sentiment Analyzer',
    description: 'Classify text sentiment as positive, negative, or neutral using a pre-trained transformer.',
    category: 'NLP',
    difficulty: 'Beginner',
    icon: <Brain className="w-6 h-6" />,
    tags: ['Python', 'Transformers', 'HuggingFace'],
    language: 'python',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=70&auto=format&fit=crop',
    snippet: `from transformers import pipeline

classifier = pipeline("sentiment-analysis")
result = classifier("I love building with AI!")
print(result)
# [{'label': 'POSITIVE', 'score': 0.9998}]`,
  },
  {
    id: 2,
    title: 'AI Chat Assistant',
    description: 'Build a streaming chat assistant with OpenAI-compatible API and React.',
    category: 'NLP',
    difficulty: 'Intermediate',
    icon: <Bot className="w-6 h-6" />,
    tags: ['React', 'TypeScript', 'LLM'],
    language: 'typescript',
    thumbnail: 'https://images.unsplash.com/photo-1684369175809-f9642140a1bf?w=600&q=70&auto=format&fit=crop',
    snippet: `const res = await fetch("/api/chat", {
  method: "POST",
  body: JSON.stringify({ messages }),
});
const reader = res.body!.getReader();
while (true) {
  const { value, done } = await reader.read();
  if (done) break;
  setText(t => t + new TextDecoder().decode(value));
}`,
  },
  {
    id: 3,
    title: 'Image Classifier',
    description: 'Classify uploaded images using TensorFlow.js MobileNet — runs entirely in the browser.',
    category: 'Vision',
    difficulty: 'Beginner',
    icon: <Sparkles className="w-6 h-6" />,
    tags: ['TensorFlow.js', 'MobileNet', 'Browser AI'],
    language: 'javascript',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=70&auto=format&fit=crop',
    snippet: `import * as mobilenet from "@tensorflow-models/mobilenet";

const model = await mobilenet.load();
const img = document.getElementById("img");
const predictions = await model.classify(img);
console.log(predictions);`,
  },
  {
    id: 4,
    title: 'RAG Document Q&A',
    description: 'Retrieve-Augmented Generation: chunk docs, embed, and query with vector similarity.',
    category: 'NLP',
    difficulty: 'Intermediate',
    icon: <Zap className="w-6 h-6" />,
    tags: ['LangChain', 'Embeddings', 'Vector DB'],
    language: 'python',
    thumbnail: 'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=600&q=70&auto=format&fit=crop',
    snippet: `from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings

db = FAISS.from_texts(chunks, OpenAIEmbeddings())
docs = db.similarity_search(query, k=3)
answer = llm.invoke(f"Context: {docs}\\nQ: {query}")`,
  },
];

const CATEGORIES: Category[] = ['All', 'Beginner', 'Intermediate', 'NLP', 'Vision'];

const AIGallery = memo(() => {
  const [ref, inView] = useReveal<HTMLDivElement>(0.05);
  const [filter, setFilter] = useState<Category>('All');
  const [active, setActive] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (filter === 'All') return AI_PROJECTS;
    if (filter === 'Beginner' || filter === 'Intermediate') {
      return AI_PROJECTS.filter((p) => p.difficulty === filter);
    }
    return AI_PROJECTS.filter((p) => p.category === filter);
  }, [filter]);

  return (
    <section
      id="ai-gallery"
      ref={ref}
      className="section-container relative bg-transparent isolate"
      aria-label="AI projects gallery"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">AI Lab</span>
        </div>
        <h2 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent mb-4">
          AI Project Gallery
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Easy-to-intermediate AI builds with live code snippets. Tap a card to expand.
        </p>
      </motion.div>

      {/* Filter chips */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              filter === cat
                ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20'
                : 'bg-card/60 text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <AnimatePresence mode="popLayout">
          {filtered.map((p, idx) => (
            <motion.article
              key={p.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="relative rounded-2xl border border-border bg-card/80 backdrop-blur-md overflow-hidden hover:border-primary/40 transition-colors group cursor-pointer"
              onClick={() => setActive(active === p.id ? null : p.id)}
            >
              {/* Thumbnail */}
              <div className="relative h-40 w-full overflow-hidden bg-muted">
                <img
                  src={p.thumbnail}
                  alt={`${p.title} preview`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/95 via-card/30 to-transparent" />
              </div>

              <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="inline-flex p-2.5 rounded-xl bg-primary/10 text-primary">
                  {p.icon}
                </div>
                <div className="flex gap-2">
                  <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${
                    p.difficulty === 'Beginner'
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {p.difficulty}
                  </span>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-muted text-muted-foreground font-semibold">
                    {p.category}
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors">
                {p.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                {p.description}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {p.tags.map((t) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>

              <AnimatePresence initial={false}>
                {active === p.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 rounded-lg bg-zinc-950 border border-zinc-800 overflow-hidden">
                      <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900 border-b border-zinc-800">
                        <div className="flex gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                          <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                        </div>
                        <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">
                          {p.language}
                        </span>
                      </div>
                      <pre className="p-3 text-[11px] leading-relaxed text-zinc-100 overflow-x-auto font-mono">
                        <code>{p.snippet}</code>
                      </pre>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-1.5 text-xs text-primary mt-3 font-semibold">
                <Code2 className="w-3.5 h-3.5" />
                {active === p.id ? 'Hide code' : 'View code snippet'}
                <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">No projects match this filter.</p>
      )}
    </section>
  );
});

AIGallery.displayName = 'AIGallery';
export default AIGallery;
