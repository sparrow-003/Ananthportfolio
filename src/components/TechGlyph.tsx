import {
  Atom,
  BookOpen,
  Bot,
  BrainCircuit,
  Braces,
  Code2,
  Database,
  Globe,
  LineChart,
  Palette,
  Rocket,
  Server,
  Wrench,
  Workflow,
} from 'lucide-react';

type TechGlyphProps = {
  className?: string;
  name: string;
};

export function TechGlyph({ name, className = 'h-4 w-4 text-primary' }: TechGlyphProps) {
  const label = name.toLowerCase();

  const Icon = (() => {
    if (/react/.test(label)) return Atom;
    if (/typescript|javascript|html|css|graphql|socket/.test(label)) return Braces;
    if (/python|jupyter|colab/.test(label)) return Code2;
    if (/node|express|django|flask|fastapi|rest/.test(label)) return Server;
    if (/next|web|frontend/.test(label)) return Globe;
    if (/openai|llm|prompt|huggingface/.test(label)) return Bot;
    if (/langchain|workflow|pipeline|transformers/.test(label)) return Workflow;
    if (/tensorflow|neural|ai|ml/.test(label)) return BrainCircuit;
    if (/pandas|numpy|scikit|analytics|data/.test(label)) return LineChart;
    if (/mongo|postgres|mysql|supabase|redis|vector|embedding|database/.test(label)) return Database;
    if (/tailwind|figma|adobe|ui|ux|design|blender/.test(label)) return Palette;
    if (/vercel|docker|git|linux|postman|vite|tool|cloud/.test(label)) return Wrench;
    if (/learn|mentor|teaching|training|book/.test(label)) return BookOpen;
    if (/deploy|launch|production/.test(label)) return Rocket;
    return Code2;
  })();

  return <Icon className={className} aria-hidden="true" />;
}