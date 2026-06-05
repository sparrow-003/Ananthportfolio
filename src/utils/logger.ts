/* eslint-disable @typescript-eslint/no-explicit-any */
// Client-Side Persistent Telemetry Logger
export interface LogEntry {
  timestamp: string;
  type: 'log' | 'warn' | 'error';
  message: string;
}

const STORAGE_KEY = 'genesis-telemetry-logs';
const MAX_LOGS = 200;

let logBuffer: LogEntry[] = [];
const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

// Initialize by loading existing logs
try {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    logBuffer = JSON.parse(stored);
  }
} catch (e) {
  logBuffer = [];
}

// Throttle saving to localStorage to prevent blocking the main thread
let saveTimeout: number | null = null;
function persistLogs() {
  if (saveTimeout !== null) return;
  
  saveTimeout = window.setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logBuffer));
    } catch (e) {
      // If quota exceeded, slice buffer in half
      logBuffer = logBuffer.slice(logBuffer.length / 2);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(logBuffer));
      } catch (_) {
        // Quota completely exhausted, do nothing
      }
    }
    saveTimeout = null;
  }, 1000); // 1-second debounce delay
}

function pushLog(type: 'log' | 'warn' | 'error', args: any[]) {
  const message = args
    .map((arg) => {
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg);
        } catch {
          return String(arg);
        }
      }
      return String(arg);
    })
    .join(' ');

  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    type,
    message,
  };

  logBuffer.push(entry);
  
  // Enforce Ring-Buffer capacity limit
  if (logBuffer.length > MAX_LOGS) {
    logBuffer.shift();
  }

  persistLogs();
}

// Intercept console streams
export function initializeLogger() {
  if ((window as any).__telemetry_logger_active__) return;
  const isLovableHost = /lovable\.app$|lovableproject\.com$|lovableproject-dev\.com$|beta\.lovable\.dev$/.test(window.location.hostname);
  if (!isLovableHost) return;
  (window as any).__telemetry_logger_active__ = true;

  console.log = (...args: any[]) => {
    originalConsoleLog.apply(console, args);
    pushLog('log', args);
  };

  console.warn = (...args: any[]) => {
    originalConsoleWarn.apply(console, args);
    pushLog('warn', args);
  };

  console.error = (...args: any[]) => {
    originalConsoleError.apply(console, args);
    pushLog('error', args);
  };

  // Log initialization message
  console.log('[Telemetry Logger] Initialized successfully. Buffering active.');
}

// Logging API
export const TelemetryLogs = {
  getLogs: (): LogEntry[] => [...logBuffer],
  clearLogs: () => {
    logBuffer = [];
    localStorage.removeItem(STORAGE_KEY);
    console.log('[Telemetry Logger] Buffer cleared.');
  },
  downloadLogs: () => {
    const text = logBuffer
      .map((entry) => `[${entry.timestamp}] [${entry.type.toUpperCase()}] ${entry.message}`)
      .join('\n');
    
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `genesis-portfolio-logs-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};
