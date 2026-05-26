import { useEffect, useState, useMemo, useRef } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { TelemetryLogs, LogEntry } from '@/utils/logger';
import { Trash2, Download, Search, Terminal, AlertTriangle, AlertCircle, Info, RefreshCw, Sparkles, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DeveloperConsole() {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'log' | 'warn' | 'error'>('all');
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Poll for logs in real-time when the console drawer is open
  useEffect(() => {
    if (!isOpen) return;
    
    const updateLogs = () => {
      setLogs(TelemetryLogs.getLogs());
    };

    updateLogs();
    const interval = setInterval(updateLogs, 800); // Poll every 800ms
    return () => clearInterval(interval);
  }, [isOpen]);

  // Hook up Ctrl+Shift+L global hotkey to toggle console
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    // Also register a custom window event so footer/logo clicks can trigger it
    const handleToggleEvent = () => setIsOpen((prev) => !prev);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('toggle-developer-console', handleToggleEvent);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('toggle-developer-console', handleToggleEvent);
    };
  }, []);

  // Auto-scroll to bottom when new logs stream in
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  // Search and Filter logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch = log.message.toLowerCase().includes(search.toLowerCase());
      const matchesType = filterType === 'all' || log.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [logs, search, filterType]);

  const handleClear = () => {
    TelemetryLogs.clearLogs();
    setLogs([]);
  };

  const handleCopyAll = () => {
    const text = filteredLogs
      .map((entry) => `[${entry.timestamp}] [${entry.type.toUpperCase()}] ${entry.message}`)
      .join('\n');
    
    navigator.clipboard.writeText(text).then(() => {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    }).catch((err) => {
      console.error('Failed to copy logs:', err);
    });
  };

  const handleCopyItem = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    }).catch((err) => {
      console.error('Failed to copy entry:', err);
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl bg-black/95 border-l border-primary/20 backdrop-blur-2xl text-foreground flex flex-col p-6 h-full shadow-[0_0_50px_rgba(var(--primary-rgb),0.15)] z-[110]"
      >
        <SheetHeader className="border-b border-primary/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20 animate-pulse">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <SheetTitle className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Genesis Core Telemetry
                <Sparkles className="h-4 w-4 text-emerald-400" />
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                Client-side persistent console log buffers & execution traces.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Toolbar & Filters */}
        <div className="flex flex-col gap-3 py-4 border-b border-primary/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search traces..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900/60 border border-primary/15 rounded-xl py-2 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all font-mono"
            />
          </div>

          <div className="flex items-center justify-between gap-2 flex-wrap">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5">
              {(['all', 'log', 'warn', 'error'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={cn(
                    "text-xs px-3 py-1.5 rounded-lg border font-medium capitalize transition-all",
                    filterType === type
                      ? "bg-primary/20 text-primary border-primary/30 shadow-[0_0_10px_rgba(var(--primary-rgb),0.1)]"
                      : "bg-transparent text-muted-foreground border-zinc-800 hover:text-foreground hover:border-zinc-700"
                  )}
                >
                  {type === 'log' ? 'Info' : type === 'all' ? 'All Traces' : type}
                </button>
              ))}
            </div>

            {/* Direct Console Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleClear}
                title="Clear logs buffer"
                className="p-2 rounded-xl bg-red-950/20 text-red-400 border border-red-500/10 hover:bg-red-950/40 hover:border-red-500/30 transition-all flex items-center gap-1.5 text-xs font-semibold"
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </button>
              <button
                onClick={handleCopyAll}
                title="Copy all logs to clipboard"
                className="p-2 rounded-xl bg-primary/20 text-primary border border-primary/15 hover:bg-primary/35 hover:border-primary/30 transition-all flex items-center gap-1.5 text-xs font-semibold"
              >
                {copiedAll ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy All
                  </>
                )}
              </button>
              <button
                onClick={TelemetryLogs.downloadLogs}
                title="Download text file report"
                className="p-2 rounded-xl bg-emerald-950/20 text-emerald-400 border border-emerald-500/10 hover:bg-emerald-950/40 hover:border-emerald-500/30 transition-all flex items-center gap-1.5 text-xs font-semibold"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable logs list */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto font-mono text-[11px] leading-relaxed p-4 bg-zinc-950/80 rounded-2xl border border-primary/5 mt-4 space-y-2 select-text custom-scrollbar scroll-smooth"
        >
          {filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
              <Terminal className="h-8 w-8 text-zinc-700 animate-pulse" />
              <span>No telemetry logs matching filters.</span>
            </div>
          ) : (
            filteredLogs.map((log, index) => {
              const dateStr = new Date(log.timestamp).toLocaleTimeString();
              const isError = log.type === 'error';
              const isWarn = log.type === 'warn';
              
              return (
                <div 
                  key={index}
                  className={cn(
                    "p-2.5 rounded-xl border flex items-start gap-3 transition-all",
                    isError && "bg-red-950/15 border-red-500/15 text-red-200",
                    isWarn && "bg-amber-950/15 border-amber-500/15 text-amber-200",
                    !isError && !isWarn && "bg-zinc-900/35 border-zinc-800/50 text-emerald-100"
                  )}
                >
                  <div className="mt-0.5">
                    {isError && <AlertCircle className="h-3.5 w-3.5 text-red-400" />}
                    {isWarn && <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />}
                    {!isError && !isWarn && <Info className="h-3.5 w-3.5 text-emerald-400" />}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded font-bold uppercase",
                          isError && "bg-red-500/10 text-red-400 border border-red-500/20",
                          isWarn && "bg-amber-500/10 text-amber-400 border border-amber-500/20",
                          !isError && !isWarn && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        )}>
                          {log.type === 'log' ? 'info' : log.type}
                        </span>
                        <button
                          onClick={() => handleCopyItem(`[${log.timestamp}] [${log.type.toUpperCase()}] ${log.message}`, index)}
                          className="p-1 rounded bg-zinc-850 hover:bg-zinc-700/50 border border-zinc-700/30 text-muted-foreground hover:text-foreground transition-all"
                          title="Copy trace log entry"
                        >
                          {copiedIndex === index ? (
                            <Check className="h-2.5 w-2.5 text-emerald-400" />
                          ) : (
                            <Copy className="h-2.5 w-2.5" />
                          )}
                        </button>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{dateStr}</span>
                    </div>
                    <p className="whitespace-pre-wrap break-all pr-1 font-mono tracking-tight">{log.message}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
