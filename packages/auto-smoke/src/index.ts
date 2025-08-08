export { RouteDiscovery } from './routeDiscovery';
export { loadConfig } from './config';
export { MarkdownReporter } from './reporters/markdown';
export { DevRunner } from './devRunner';
export { LighthouseRunner } from './lighthouse';
export { AuthManager } from './auth';

export type {
  RouteConfig,
  SmokeConfig,
  DiscoveredRoute
} from './routeDiscovery';

export type {
  SmokeRunnerConfig
} from './config';

export type {
  TestResult,
  LighthouseResult,
  ReportData
} from './reporters/markdown';

export type {
  LighthouseMetrics,
  LighthouseResult as LighthouseTestResult
} from './lighthouse';

export type {
  AuthConfig
} from './auth';