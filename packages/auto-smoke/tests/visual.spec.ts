import { test, expect } from '@playwright/test';
import { RouteDiscovery } from '../src/routeDiscovery';
import { loadConfig } from '../src/config';
import * as path from 'path';

const config = loadConfig();
const routeDiscovery = new RouteDiscovery(config.projectRoot);

test.describe('Visual Regression Tests', () => {
  test.skip(!config.visualMode, 'Visual tests only run with VISUAL=1');
  
  let routes: any[] = [];
  
  test.beforeAll(async () => {
    routes = await routeDiscovery.discoverRoutes();
    if (config.routeLimit) {
      routes = routes.slice(0, config.routeLimit);
    }
  });

  test.beforeEach(async ({ page }) => {
    if (config.authMode === 'cookie' && config.authCookie) {
      const [name, value] = config.authCookie.split('=');
      await page.context().addCookies([{
        name,
        value,
        domain: new URL(config.baseUrl).hostname,
        path: '/'
      }]);
    }
  });

  for (const route of routes || []) {
    test(`Visual: ${route.path}`, async ({ page }) => {
      const url = `${config.baseUrl}${route.path}`;
      
      await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: config.timeout
      });
      
      await page.waitForTimeout(1000);
      
      const screenshotName = route.path === '/' 
        ? 'home.png' 
        : `${route.path.replace(/\//g, '_')}.png`;
      
      await expect(page).toHaveScreenshot(screenshotName, {
        fullPage: true,
        maxDiffPixels: 100,
        threshold: 0.2,
        animations: 'disabled'
      });
    });
  }
});