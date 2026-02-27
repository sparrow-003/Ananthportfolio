import { useEffect } from 'react';

export const usePerformanceMetrics = () => {
  useEffect(() => {
    const logMetrics = () => {
      if (typeof window === 'undefined' || !window.performance) return;

      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      const metrics: Record<string, string | number> = {};

      // Navigation timing
      if (navigation) {
        metrics['DNS Lookup'] = `${(navigation.domainLookupEnd - navigation.domainLookupStart).toFixed(2)}ms`;
        metrics['TCP Connection'] = `${(navigation.connectEnd - navigation.connectStart).toFixed(2)}ms`;
        metrics['Request Time'] = `${(navigation.responseStart - navigation.requestStart).toFixed(2)}ms`;
        metrics['Response Time'] = `${(navigation.responseEnd - navigation.responseStart).toFixed(2)}ms`;
        metrics['DOM Interactive'] = `${navigation.domInteractive.toFixed(2)}ms`;
        metrics['DOM Complete'] = `${navigation.domComplete.toFixed(2)}ms`;
        metrics['Page Load'] = `${navigation.loadEventEnd.toFixed(2)}ms`;
      }

      // Paint timing
      paint.forEach((entry) => {
        if (entry.name === 'first-paint') {
          metrics['First Paint'] = `${entry.startTime.toFixed(2)}ms`;
        }
        if (entry.name === 'first-contentful-paint') {
          metrics['First Contentful Paint'] = `${entry.startTime.toFixed(2)}ms`;
        }
      });

      // Memory (Chrome only)
      const memoryInfo = (performance as any).memory;
      if (memoryInfo) {
        metrics['JS Heap Size'] = `${(memoryInfo.usedJSHeapSize / 1048576).toFixed(2)}MB`;
        metrics['Total JS Heap'] = `${(memoryInfo.totalJSHeapSize / 1048576).toFixed(2)}MB`;
      }

      // Log metrics
      console.group('%c📊 Performance Metrics', 'color: #10b981; font-weight: bold; font-size: 14px');
      Object.entries(metrics).forEach(([key, value]) => {
        console.log(`%c${key}: %c${value}`, 'color: #6b7280', 'color: #10b981; font-weight: bold');
      });
      console.groupEnd();
    };

    // Wait for page load to complete
    if (document.readyState === 'complete') {
      setTimeout(logMetrics, 100);
    } else {
      window.addEventListener('load', () => setTimeout(logMetrics, 100));
    }

    // Log LCP and CLS using PerformanceObserver
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log(`%c🎨 Largest Contentful Paint: %c${lastEntry.startTime.toFixed(2)}ms`, 
          'color: #6b7280', 'color: #10b981; font-weight: bold');
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      const clsObserver = new PerformanceObserver((list) => {
        let clsScore = 0;
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsScore += entry.value;
          }
        });
        if (clsScore > 0) {
          console.log(`%c📐 Cumulative Layout Shift: %c${clsScore.toFixed(4)}`, 
            'color: #6b7280', 'color: #10b981; font-weight: bold');
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      // PerformanceObserver not supported
    }
  }, []);
};

export default usePerformanceMetrics;
