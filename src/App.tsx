import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy, memo } from "react";
import { HelmetProvider } from "react-helmet-async";
// Vercel analytics — only loads when actually deployed on Vercel (avoids 404 noise on other hosts)
const isVercel = typeof window !== 'undefined' && /\.vercel\.app$/.test(window.location.hostname);
const Analytics = isVercel ? lazy(() => import("@vercel/analytics/react").then(m => ({ default: m.Analytics }))) : () => null;
const SpeedInsights = isVercel ? lazy(() => import("@vercel/speed-insights/react").then(m => ({ default: m.SpeedInsights }))) : () => null;
import { ThemeProvider } from "@/components/theme-provider";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import Layout from "./components/Layout";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogSystemTest = lazy(() => import("./components/BlogSystemTest"));

// Optimized query client with better caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const LoadingSpinner = memo(() => (
  <div className="flex items-center justify-center min-h-screen bg-black relative overflow-hidden">
    <div className="relative">
      <div className="w-16 h-16 rounded-full border-2 border-primary/10" />
      <div className="absolute inset-0 w-16 h-16 rounded-full border-t-2 border-primary animate-spin" />
      <div className="absolute inset-2 w-12 h-12 rounded-full border-b-2 border-primary/50 animate-reverse-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-1 h-1 bg-primary rounded-full animate-ping" />
      </div>
    </div>
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

const App = memo(() => (
  <ErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <TooltipProvider>
            <div className="w-full min-h-screen bg-transparent text-foreground selection:bg-emerald-500/30 selection:text-emerald-200">
              <Toaster />
              <Sonner position="top-center" richColors closeButton />
              <BrowserRouter>
                <ScrollToTop />
                <ErrorBoundary>
                  <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                      <Route element={<Layout />}>
                        <Route path="/" element={<Index />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/:slug" element={<Blog />} />
                        <Route path="/blog-system-test" element={<BlogSystemTest />} />
                        <Route path="*" element={<NotFound />} />
                      </Route>
                      <Route path="/genesis-node-control-x99-admin" element={<AdminPanel />} />
                    </Routes>
                  </Suspense>
                </ErrorBoundary>
              </BrowserRouter>
              <Suspense fallback={null}>
                <Analytics />
                <SpeedInsights />
              </Suspense>
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
));

App.displayName = 'App';

export default App;
