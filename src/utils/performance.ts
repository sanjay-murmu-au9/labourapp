import { analytics } from '../services/api/queryClient';
import { PerformanceObserver, performance } from 'perf_hooks';
import { logEvent } from 'firebase/analytics';

class PerformanceMonitor {
  private static marks: Map<string, number> = new Map();

  static startMeasure(name: string) {
    this.marks.set(name, performance.now());
  }

  static endMeasure(name: string, metadata?: Record<string, any>) {
    const startTime = this.marks.get(name);
    if (startTime) {
      const duration = performance.now() - startTime;
      this.marks.delete(name);

      // Log performance data to Firebase Analytics
      logEvent(analytics, 'performance_measure', {
        name,
        duration,
        ...metadata,
      });

      if (duration > 1000) {
        console.warn(`Performance warning: ${name} took ${duration}ms`);
      }
    }
  }

  static async measureAsync<T>(
    name: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    this.startMeasure(name);
    try {
      const result = await fn();
      this.endMeasure(name, metadata);
      return result;
    } catch (error) {
      this.endMeasure(name, { ...metadata, error: true });
      throw error;
    }
  }
}