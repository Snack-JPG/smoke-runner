export interface SmokeRunnerConfig {
  baseUrl: string;
  concurrency: number;
  routeLimit?: number;
  authMode: 'none' | 'cookie' | 'magic_link';
  authCookie?: string;
  magicLinkPath?: string;
  visualMode: boolean;
  slackWebhook?: string;
  devStart?: string;
  projectRoot: string;
  timeout: number;
  retries: number;
}

export function loadConfig(): SmokeRunnerConfig {
  return {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    concurrency: parseInt(process.env.SMOKE_CONCURRENCY || '4', 10),
    routeLimit: process.env.ROUTE_LIMIT ? parseInt(process.env.ROUTE_LIMIT, 10) : undefined,
    authMode: (process.env.AUTH_MODE as any) || 'none',
    authCookie: process.env.AUTH_COOKIE,
    magicLinkPath: process.env.MAGIC_LINK_PATH,
    visualMode: process.env.VISUAL === '1' || process.env.VISUAL === 'true',
    slackWebhook: process.env.SMOKE_SLACK_WEBHOOK,
    devStart: process.env.DEV_START,
    projectRoot: process.env.PROJECT_ROOT || process.cwd(),
    timeout: parseInt(process.env.TIMEOUT || '30000', 10),
    retries: parseInt(process.env.RETRIES || '2', 10)
  };
}