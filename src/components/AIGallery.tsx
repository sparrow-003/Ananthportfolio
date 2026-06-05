import { memo, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReveal } from "@/hooks/useReveal";
import {
  Sparkles,
  Bot,
  Brain,
  Code2,
  Zap,
  ChevronRight,
  Search,
  Wand2,
  Layers,
  Tag,
} from "lucide-react";
import {
  SiPython,
  SiOpenai,
  SiLangchain,
  SiHuggingface,
  SiTypescript,
  SiReact,
  SiNodedotjs,
} from "react-icons/si";

type Category = "All" | "Beginner" | "Intermediate" | "NLP";

interface AIProject {
  id: number;
  title: string;
  description: string;
  category: Exclude<Category, "All">;
  difficulty: "Beginner" | "Intermediate";
  icon: React.ReactNode;
  tags: string[];
  snippet: string;
  language: string;
  gradient: string;
  accent: string;
  meta: { label: string; value: string }[];
  demoUrl?: string;
}

const AI_PROJECTS: AIProject[] = [
  {
    id: 1,
    title: "Sentiment Analyzer",
    description:
      "Classify text sentiment as positive, negative, or neutral using a pre-trained transformer in 3 lines.",
    category: "NLP",
    difficulty: "Beginner",
    icon: <Brain className="w-5 h-5" />,
    tags: ["Python", "Transformers", "HuggingFace"],
    language: "python",
    gradient: "from-[#0077CC] via-[#0D87CC] to-[#0A0A0F]",
    accent: "#0077CC",
    meta: [
      { label: "Type", value: "NLP" },
      { label: "Level", value: "Beginner" },
    ],
    snippet: `from transformers import pipeline

classifier = pipeline("sentiment-analysis")
result = classifier("I love building with AI!")
print(result)
# [{'label': 'POSITIVE', 'score': 0.9998}]`,
  },
  {
    id: 2,
    title: "AI Chat Assistant",
    description:
      "Streaming chat assistant with OpenAI-compatible API, React front-end, and conversation history.",
    category: "NLP",
    difficulty: "Intermediate",
    icon: <Bot className="w-5 h-5" />,
    tags: ["React", "TypeScript", "LLM"],
    language: "typescript",
    gradient: "from-[#7C3AED] via-[#0077CC] to-[#0A0A0F]",
    accent: "#7C3AED",
    meta: [
      { label: "Type", value: "NLP" },
      { label: "Level", value: "Intermediate" },
    ],
    demoUrl: "https://v0-smart-document-summarizer.vercel.app",
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
    title: "RAG Document Q&A",
    description:
      "Retrieve-Augmented Generation: chunk docs, embed, and query with vector similarity.",
    category: "NLP",
    difficulty: "Intermediate",
    icon: <Wand2 className="w-5 h-5" />,
    tags: ["LangChain", "Embeddings", "Vector DB"],
    language: "python",
    gradient: "from-[#10B981] via-[#0077CC] to-[#0A0A0F]",
    accent: "#10B981",
    meta: [
      { label: "Type", value: "NLP" },
      { label: "Level", value: "Intermediate" },
    ],
    snippet: `from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings

db = FAISS.from_texts(chunks, OpenAIEmbeddings())
docs = db.similarity_search(query, k=3)
answer = llm.invoke(f"Context: {docs}\\nQ: {query}")`,
  },
];

const CATEGORIES: { id: Category; label: string; icon: React.ReactNode }[] = [
  { id: "All", label: "All", icon: <Layers className="w-3.5 h-3.5" /> },
  { id: "Beginner", label: "Beginner", icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: "Intermediate", label: "Intermediate", icon: <Zap className="w-3.5 h-3.5" /> },
  { id: "NLP", label: "NLP", icon: <Brain className="w-3.5 h-3.5" /> },
];

const techLogo: Record<string, React.ReactNode> = {
  Python: <SiPython className="w-3.5 h-3.5" style={{ color: "#3776AB" }} />,
  Transformers: <SiHuggingface className="w-3.5 h-3.5" style={{ color: "#FFD21E" }} />,
  HuggingFace: <SiHuggingface className="w-3.5 h-3.5" style={{ color: "#FFD21E" }} />,
  LangChain: <SiLangchain className="w-3.5 h-3.5" style={{ color: "#1C3C3C" }} />,
  React: <SiReact className="w-3.5 h-3.5" style={{ color: "#61DAFB" }} />,
  TypeScript: <SiTypescript className="w-3.5 h-3.5" style={{ color: "#3178C6" }} />,
  LLM: <SiOpenai className="w-3.5 h-3.5" />,
  OpenAI: <SiOpenai className="w-3.5 h-3.5" />,
  "Node.js": <SiNodedotjs className="w-3.5 h-3.5" style={{ color: "#339933" }} />,
  Embeddings: <SiOpenai className="w-3.5 h-3.5" />,
  "Vector DB": <SiHuggingface className="w-3.5 h-3.5" style={{ color: "#FFD21E" }} />,
};

const AICard = ({
  p,
  isActive,
  onClick,
}: {
  p: AIProject;
  isActive: boolean;
  onClick: () => void;
}) => (
  <motion.article
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.35 }}
    className={`relative rounded-2xl border bg-card overflow-hidden cursor-pointer group transition-all duration-500 ${
      isActive
        ? "border-primary/50 shadow-2xl shadow-primary/10"
        : "border-border hover:border-primary/30 hover:-translate-y-1"
    }`}
    onClick={onClick}
  >
    {/* Visual header — gradient art */}
    <div
      className={`relative h-28 sm:h-32 bg-gradient-to-br ${p.gradient} overflow-hidden`}
    >
      <div className="absolute inset-0 opacity-30 mix-blend-overlay">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/20 blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-black/30 blur-2xl" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="relative h-full flex items-center justify-between p-4">
        <div
          className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white"
          style={{ boxShadow: `0 0 24px ${p.accent}55` }}
        >
          {p.icon}
        </div>
        <span
          className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${
            p.difficulty === "Beginner"
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
              : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
          }`}
        >
          {p.difficulty}
        </span>
      </div>
    </div>

    <div className="p-5">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
          {p.title}
        </h3>
        <span
          className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{ color: p.accent, backgroundColor: `${p.accent}1A`, border: `1px solid ${p.accent}33` }}
        >
          {p.category}
        </span>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
        {p.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {p.tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-md bg-muted/60 border border-border text-foreground/80 font-medium"
          >
            {techLogo[t] ?? <Tag className="w-3 h-3 text-muted-foreground" />}
            {t}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="inline-flex items-center gap-1.5 text-primary font-semibold">
          <Code2 className="w-3.5 h-3.5" />
          {isActive ? "Hide code" : "View snippet"}
        </span>
        <ChevronRight
          className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${
            isActive ? "rotate-90 text-primary" : "group-hover:translate-x-1"
          }`}
        />
      </div>

      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-xl border border-border bg-[#0A0A0F] overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b border-border/50 bg-card/30">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
                  {p.language}
                </span>
              </div>
              <pre className="p-3 text-[11px] leading-relaxed text-foreground/90 overflow-x-auto font-mono">
                <code>{p.snippet}</code>
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </motion.article>
);

const AIGallery = memo(() => {
  const [ref, inView] = useReveal<HTMLDivElement>(0.05);
  const [filter, setFilter] = useState<Category>("All");
  const [active, setActive] = useState<number | null>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list = AI_PROJECTS;
    if (filter === "Beginner" || filter === "Intermediate") {
      list = list.filter((p) => p.difficulty === filter);
    } else if (filter !== "All") {
      list = list.filter((p) => p.category === filter);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [filter, query]);

  const counts = useMemo(
    () => ({
      total: AI_PROJECTS.length,
      beginner: AI_PROJECTS.filter((p) => p.difficulty === "Beginner").length,
      intermediate: AI_PROJECTS.filter((p) => p.difficulty === "Intermediate").length,
      nlp: AI_PROJECTS.filter((p) => p.category === "NLP").length,
    }),
    []
  );

  return (
    <section
      id="ai-gallery"
      ref={ref}
      className="section-container relative bg-transparent isolate"
      aria-label="AI projects gallery"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            AI Lab
          </span>
        </div>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gradient mb-3">
          AI Project Gallery
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Hands-on builds spanning beginner to intermediate. Tap any card to
          expand a runnable code snippet.
        </p>
      </motion.div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 max-w-3xl mx-auto">
        {[
          { label: "Total Builds", value: counts.total, color: "#0077CC" },
          { label: "Beginner", value: counts.beginner, color: "#10B981" },
          { label: "Intermediate", value: counts.intermediate, color: "#E89122" },
          { label: "Projects", value: counts.nlp, color: "#7C3AED" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-border bg-card/60 p-3 text-center"
          >
            <p className="text-2xl font-bold" style={{ color: s.color }}>
              {s.value}
            </p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Filter + search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 max-w-5xl mx-auto">
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                filter === cat.id
                  ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                  : "bg-card/60 text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects…"
            className="w-full pl-9 pr-3 py-2 rounded-full bg-card/60 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {filtered.map((p) => (
            <AICard
              key={p.id}
              p={p}
              isActive={active === p.id}
              onClick={() => setActive(active === p.id ? null : p.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            No projects match this filter. Try a different category.
          </p>
        </div>
      )}
    </section>
  );
});

AIGallery.displayName = "AIGallery";
export default AIGallery;
