// Type definitions for Performance API
interface Performance {
  getEntriesByType(entryType: string): PerformanceEntry[];
  timing?: PerformanceTiming;
}

interface PerformanceTiming {
  navigationStart: number;
  loadEventEnd: number;
  domContentLoadedEventEnd: number;
}

interface PerformanceEntry {
  name: string;
  entryType: string;
  startTime: number;
  duration: number;
}

interface PerformanceResourceTiming extends PerformanceEntry {
  initiatorType: string;
  transferSize: number;
  decodedBodySize: number;
  name: string;
}

interface Navigator {
  connection?: {
    effectiveType: string;
    downlink: number;
    rtt: number;
    saveData: boolean;
  };
}