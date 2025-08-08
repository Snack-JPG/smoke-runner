#!/usr/bin/env node

import { spawn, ChildProcess } from 'child_process';
import { loadConfig } from './config';
import { RouteDiscovery } from './routeDiscovery';
import { MarkdownReporter, TestResult, ReportData } from './reporters/markdown';
import * as chokidar from 'chokidar';
import * as waitOn from 'wait-on';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';

class DevRunner {
  private config = loadConfig();
  private appProcess?: ChildProcess;
  private routeDiscovery: RouteDiscovery;
  private reporter: MarkdownReporter;
  private isRunning = false;

  constructor() {
    this.routeDiscovery = new RouteDiscovery(this.config.projectRoot);
    this.reporter = new MarkdownReporter('./smoke-report.md');
  }

  async start(): void {
    console.log(chalk.blue('🚀 Starting Smoke Runner Dev Mode'));
    
    try {
      if (this.config.devStart) {
        await this.startApp();
      }
      
      await this.waitForApp();
      await this.runInitialTests();
      this.startWatcher();
      
      console.log(chalk.green('👀 Watching for changes...'));
      console.log(chalk.gray('Press Ctrl+C to stop'));
      
    } catch (error) {
      console.error(chalk.red('❌ Failed to start dev runner:'), error);
      this.cleanup();
      process.exit(1);
    }
  }

  private async startApp(): Promise<void> {
    console.log(chalk.yellow('🏗️  Starting app:', this.config.devStart));
    
    const [command, ...args] = this.config.devStart!.split(' ');
    this.appProcess = spawn(command, args, {
      stdio: 'pipe',
      cwd: this.config.projectRoot,
      detached: false
    });

    this.appProcess.stdout?.on('data', (data) => {
      const output = data.toString();
      if (output.includes('ready') || output.includes('started') || output.includes('listening')) {
        console.log(chalk.gray('📱 App:'), output.trim());
      }
    });

    this.appProcess.stderr?.on('data', (data) => {
      console.log(chalk.gray('📱 App:'), data.toString().trim());
    });

    this.appProcess.on('error', (error) => {
      console.error(chalk.red('❌ App process error:'), error);
    });

    this.appProcess.on('exit', (code) => {
      if (code !== 0 && code !== null) {
        console.log(chalk.yellow('⚠️  App process exited with code:', code));
      }
    });
  }

  private async waitForApp(): Promise<void> {
    console.log(chalk.yellow('⏳ Waiting for app at', this.config.baseUrl));
    
    try {
      await waitOn({
        resources: [this.config.baseUrl],
        delay: 1000,
        interval: 2000,
        timeout: 60000,
        verbose: false
      });
      
      console.log(chalk.green('✅ App is ready!'));
    } catch (error) {
      throw new Error(`App failed to start at ${this.config.baseUrl}: ${error}`);
    }
  }

  private async runInitialTests(): Promise<void> {
    console.log(chalk.blue('🧪 Running initial smoke tests...'));
    await this.runTests();
  }

  private async runTests(): Promise<void> {
    if (this.isRunning) {
      console.log(chalk.yellow('⏳ Tests already running, skipping...'));
      return;
    }

    this.isRunning = true;
    const startTime = Date.now();

    try {
      const routes = await this.routeDiscovery.discoverRoutes();
      console.log(chalk.blue(`🔍 Discovered ${routes.length} routes`));
      
      if (!fs.existsSync('.cache/routes')) {
        fs.mkdirSync('.cache/routes', { recursive: true });
      }
      
      fs.writeFileSync(
        '.cache/routes/generated.json',
        JSON.stringify(routes, null, 2)
      );

      console.log(chalk.yellow('🎭 Running Playwright tests...'));
      await this.runPlaywrightTests();
      
      const duration = Date.now() - startTime;
      await this.generateReport(routes.length, duration);
      
    } catch (error) {
      console.error(chalk.red('❌ Test run failed:'), error);
    } finally {
      this.isRunning = false;
    }
  }

  private async runPlaywrightTests(): Promise<void> {
    return new Promise((resolve, reject) => {
      const playwrightProcess = spawn('npx', ['playwright', 'test', '--reporter=list'], {
        stdio: 'inherit',
        cwd: path.resolve(__dirname, '..'),
        env: { ...process.env, ...this.getTestEnvVars() }
      });

      playwrightProcess.on('exit', (code) => {
        if (code === 0 || code === 1) {
          resolve();
        } else {
          reject(new Error(`Playwright tests failed with code ${code}`));
        }
      });

      playwrightProcess.on('error', reject);
    });
  }

  private getTestEnvVars(): Record<string, string> {
    return {
      BASE_URL: this.config.baseUrl,
      PROJECT_ROOT: this.config.projectRoot,
      AUTH_MODE: this.config.authMode,
      AUTH_COOKIE: this.config.authCookie || '',
      TIMEOUT: this.config.timeout.toString(),
      RETRIES: this.config.retries.toString()
    };
  }

  private async generateReport(totalRoutes: number, duration: number): Promise<void> {
    try {
      const testResults = await this.parseTestResults();
      
      const reportData: ReportData = {
        testResults,
        totalRoutes,
        passed: testResults.filter(r => r.status === 'passed').length,
        failed: testResults.filter(r => r.status === 'failed').length,
        skipped: testResults.filter(r => r.status === 'skipped').length,
        duration,
        timestamp: new Date().toISOString()
      };

      await this.reporter.saveReport(reportData);
      
      if (this.config.slackWebhook) {
        await this.reporter.sendToSlack(this.config.slackWebhook, reportData);
      }
      
      console.log(chalk.green('📊 Report generated!'));
      
    } catch (error) {
      console.error(chalk.red('❌ Failed to generate report:'), error);
    }
  }

  private async parseTestResults(): Promise<TestResult[]> {
    const results: TestResult[] = [];
    const resultsDir = path.join(__dirname, '../test-results');
    
    if (!fs.existsSync(resultsDir)) {
      return results;
    }
    
    try {
      const reportPath = path.join(__dirname, '../playwright-report/index.html');
      if (fs.existsSync(reportPath)) {
        console.log(chalk.blue('📊 Playwright report available at:'), reportPath);
      }
      
      const evidenceDir = path.join(this.config.projectRoot, '.cache/evidence');
      if (fs.existsSync(evidenceDir)) {
        const evidenceFiles = fs.readdirSync(evidenceDir).filter(f => f.endsWith('.json'));
        
        for (const file of evidenceFiles) {
          const evidencePath = path.join(evidenceDir, file);
          const evidence = JSON.parse(fs.readFileSync(evidencePath, 'utf-8'));
          
          results.push({
            route: evidence.route,
            status: evidence.consoleErrors?.length > 0 || evidence.pageErrors?.length > 0 ? 'failed' : 'passed',
            errors: [...(evidence.consoleErrors || []), ...(evidence.pageErrors || [])]
          });
        }
      }
    } catch (error) {
      console.warn(chalk.yellow('⚠️  Could not parse test results:'), error);
    }
    
    return results;
  }

  private startWatcher(): void {
    const watchPatterns = [
      path.join(this.config.projectRoot, 'app/**/page.{tsx,jsx,ts,js}'),
      path.join(this.config.projectRoot, 'pages/**/*.{tsx,jsx,ts,js}'),
      path.join(this.config.projectRoot, '.smoke.yml')
    ];

    const watcher = chokidar.watch(watchPatterns, {
      ignored: ['**/node_modules/**', '**/.git/**'],
      persistent: true,
      ignoreInitial: true
    });

    let timeoutId: NodeJS.Timeout;

    watcher.on('all', (event, filePath) => {
      console.log(chalk.cyan(`📝 ${event}:`), path.relative(this.config.projectRoot, filePath));
      
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        console.log(chalk.blue('🔄 Re-running tests...'));
        this.runTests();
      }, 2000);
    });

    process.on('SIGINT', () => {
      console.log(chalk.yellow('\n🛑 Stopping watcher...'));
      watcher.close();
      this.cleanup();
      process.exit(0);
    });
  }

  private cleanup(): void {
    if (this.appProcess) {
      console.log(chalk.yellow('🛑 Stopping app process...'));
      this.appProcess.kill('SIGTERM');
      
      setTimeout(() => {
        if (this.appProcess && !this.appProcess.killed) {
          this.appProcess.kill('SIGKILL');
        }
      }, 5000);
    }
  }
}

if (require.main === module) {
  const runner = new DevRunner();
  runner.start().catch(console.error);
}

export { DevRunner };