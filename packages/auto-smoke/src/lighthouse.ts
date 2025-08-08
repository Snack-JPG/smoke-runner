import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';
import { loadConfig } from './config';
import { RouteDiscovery } from './routeDiscovery';

const execAsync = promisify(exec);

export interface LighthouseMetrics {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  pwa?: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  totalBlockingTime: number;
  speedIndex: number;
}

export interface LighthouseResult {
  url: string;
  route: string;
  metrics: LighthouseMetrics;
  rawReport: any;
  timestamp: string;
}

export class LighthouseRunner {
  private config = loadConfig();
  private outputDir = path.join(process.cwd(), '.cache/lighthouse');

  constructor() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async runForAllRoutes(): Promise<LighthouseResult[]> {
    const routeDiscovery = new RouteDiscovery(this.config.projectRoot);
    const routes = await routeDiscovery.discoverRoutes();
    
    const results: LighthouseResult[] = [];
    
    console.log(`🔍 Running Lighthouse on ${routes.length} routes...`);
    
    for (const route of routes.slice(0, this.config.routeLimit || 5)) {
      const url = `${this.config.baseUrl}${route.path}`;
      console.log(`📊 Analyzing ${url}...`);
      
      try {
        const result = await this.runForUrl(url, route.path);
        results.push(result);
        
        const score = Math.round(result.metrics.performance * 100);
        console.log(`✅ ${route.path}: Performance ${score}%`);
      } catch (error) {
        console.error(`❌ Failed to analyze ${route.path}:`, error);
      }
    }
    
    return results;
  }

  async runForUrl(url: string, route: string): Promise<LighthouseResult> {
    const outputFile = path.join(this.outputDir, `${route.replace(/\//g, '_')}_lighthouse.json`);
    
    const command = [
      'lighthouse',
      url,
      '--output=json',
      `--output-path=${outputFile}`,
      '--preset=desktop',
      '--quiet',
      '--chrome-flags="--headless --no-sandbox --disable-gpu"',
      '--throttling-method=simulate',
      '--throttling.rttMs=40',
      '--throttling.throughputKbps=10240',
      '--throttling.cpuSlowdownMultiplier=1'
    ].join(' ');

    try {
      await execAsync(command);
      
      const reportData = JSON.parse(fs.readFileSync(outputFile, 'utf-8'));
      const categories = reportData.categories;
      const audits = reportData.audits;

      const metrics: LighthouseMetrics = {
        performance: categories.performance?.score || 0,
        accessibility: categories.accessibility?.score || 0,
        bestPractices: categories['best-practices']?.score || 0,
        seo: categories.seo?.score || 0,
        pwa: categories.pwa?.score,
        firstContentfulPaint: audits['first-contentful-paint']?.numericValue || 0,
        largestContentfulPaint: audits['largest-contentful-paint']?.numericValue || 0,
        cumulativeLayoutShift: audits['cumulative-layout-shift']?.numericValue || 0,
        totalBlockingTime: audits['total-blocking-time']?.numericValue || 0,
        speedIndex: audits['speed-index']?.numericValue || 0
      };

      return {
        url,
        route,
        metrics,
        rawReport: reportData,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Lighthouse failed for ${url}: ${error}`);
    }
  }

  async generateSummaryReport(results: LighthouseResult[]): Promise<void> {
    const summaryPath = path.join(this.outputDir, 'summary.json');
    
    const summary = {
      totalRoutes: results.length,
      averageScores: {
        performance: this.average(results.map(r => r.metrics.performance)),
        accessibility: this.average(results.map(r => r.metrics.accessibility)),
        bestPractices: this.average(results.map(r => r.metrics.bestPractices)),
        seo: this.average(results.map(r => r.metrics.seo))
      },
      worstPerformers: results
        .sort((a, b) => a.metrics.performance - b.metrics.performance)
        .slice(0, 3)
        .map(r => ({
          route: r.route,
          performance: Math.round(r.metrics.performance * 100),
          fcp: Math.round(r.metrics.firstContentfulPaint),
          lcp: Math.round(r.metrics.largestContentfulPaint)
        })),
      timestamp: new Date().toISOString()
    };

    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    console.log(`📊 Lighthouse summary saved to ${summaryPath}`);
  }

  private average(values: number[]): number {
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  }
}