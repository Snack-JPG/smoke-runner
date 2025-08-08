import { glob } from 'glob';
import * as path from 'path';
import * as fs from 'fs';
import * as yaml from 'yaml';

export interface RouteConfig {
  must_exist?: string[];
  must_not_error?: boolean;
  demo_flow?: Array<{
    click?: string;
    type?: { selector: string; text: string };
    expect_text?: string;
  }>;
  sample_params?: Record<string, string>;
}

export interface SmokeConfig {
  defaults?: {
    must_exist?: string[];
    must_not_error?: boolean;
  };
  routes?: Record<string, RouteConfig>;
  auth?: {
    mode: 'none' | 'cookie' | 'magic_link';
    cookie?: string;
    magic_link_path?: string;
  };
  axe?: {
    ignore?: string[];
  };
  visual?: {
    enabled?: boolean;
    threshold?: number;
  };
}

export interface DiscoveredRoute {
  path: string;
  filePath: string;
  config: RouteConfig;
  isDynamic: boolean;
}

export class RouteDiscovery {
  private projectRoot: string;
  private config: SmokeConfig = {};

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    this.loadConfig();
  }

  private loadConfig(): void {
    const configPath = path.join(this.projectRoot, '.smoke.yml');
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf-8');
      this.config = yaml.parse(content) || {};
    }
  }

  async discoverRoutes(): Promise<DiscoveredRoute[]> {
    const routes: DiscoveredRoute[] = [];
    
    const appRouterPattern = path.join(this.projectRoot, 'app/**/page.{tsx,jsx,ts,js}');
    const appRouterFiles = await glob(appRouterPattern, { ignore: ['**/node_modules/**'] });
    
    for (const file of appRouterFiles) {
      const route = this.fileToRoute(file, 'app');
      routes.push(route);
    }

    const pagesRouterPattern = path.join(this.projectRoot, 'pages/**/*.{tsx,jsx,ts,js}');
    const pagesRouterFiles = await glob(pagesRouterPattern, {
      ignore: [
        '**/node_modules/**',
        '**/pages/_app.*',
        '**/pages/_document.*',
        '**/pages/api/**'
      ]
    });

    for (const file of pagesRouterFiles) {
      const route = this.fileToRoute(file, 'pages');
      routes.push(route);
    }

    const configuredRoutes = Object.keys(this.config.routes || {});
    for (const routePath of configuredRoutes) {
      if (!routes.find(r => r.path === routePath)) {
        routes.push({
          path: routePath,
          filePath: '',
          config: this.config.routes![routePath],
          isDynamic: routePath.includes('[')
        });
      }
    }

    return this.processRoutes(routes);
  }

  private fileToRoute(filePath: string, routerType: 'app' | 'pages'): DiscoveredRoute {
    const relativePath = path.relative(this.projectRoot, filePath);
    let routePath: string;

    if (routerType === 'app') {
      routePath = relativePath
        .replace(/^app/, '')
        .replace(/\/page\.(tsx|jsx|ts|js)$/, '')
        .replace(/\/\(.*?\)/g, '');
    } else {
      routePath = relativePath
        .replace(/^pages/, '')
        .replace(/\.(tsx|jsx|ts|js)$/, '')
        .replace(/\/index$/, '');
    }

    if (!routePath || routePath === '') {
      routePath = '/';
    } else if (!routePath.startsWith('/')) {
      routePath = '/' + routePath;
    }

    const isDynamic = routePath.includes('[');
    const config = this.config.routes?.[routePath] || {};

    return {
      path: routePath,
      filePath,
      config: { ...this.config.defaults, ...config },
      isDynamic
    };
  }

  private processRoutes(routes: DiscoveredRoute[]): DiscoveredRoute[] {
    return routes.map(route => {
      if (route.isDynamic && route.config.sample_params) {
        let processedPath = route.path;
        for (const [param, value] of Object.entries(route.config.sample_params)) {
          processedPath = processedPath.replace(`[${param}]`, value);
        }
        return {
          ...route,
          path: processedPath,
          isDynamic: false
        };
      }
      
      if (route.isDynamic) {
        console.warn(`⚠️  Skipping dynamic route ${route.path} - no sample_params provided`);
        return null;
      }
      
      return route;
    }).filter(Boolean) as DiscoveredRoute[];
  }

  getConfig(): SmokeConfig {
    return this.config;
  }
}