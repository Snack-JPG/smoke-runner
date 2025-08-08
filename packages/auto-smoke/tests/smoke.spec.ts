import { test, expect, Page } from '@playwright/test';
import { RouteDiscovery } from '../src/routeDiscovery';
import { loadConfig } from '../src/config';
import AxeBuilder from '@axe-core/playwright';
import * as fs from 'fs';
import * as path from 'path';

const config = loadConfig();
const routeDiscovery = new RouteDiscovery(config.projectRoot);

test.describe('Smoke Tests', () => {
  let routes: any[] = [];
  let consoleErrors: string[] = [];
  let pageErrors: string[] = [];
  
  test.beforeAll(async () => {
    routes = await routeDiscovery.discoverRoutes();
    if (config.routeLimit) {
      routes = routes.slice(0, config.routeLimit);
    }
    
    if (!fs.existsSync('.cache/evidence')) {
      fs.mkdirSync('.cache/evidence', { recursive: true });
    }
  });

  test.beforeEach(async ({ page }) => {
    consoleErrors = [];
    pageErrors = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    page.on('pageerror', error => {
      pageErrors.push(error.message);
    });

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
    test(`Route: ${route.path}`, async ({ page }) => {
      const url = `${config.baseUrl}${route.path}`;
      
      const response = await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: config.timeout
      });
      
      expect(response?.status()).toBe(200);
      
      const mustExist = route.config.must_exist || ['main'];
      for (const selector of mustExist) {
        await expect(page.locator(selector).first()).toBeVisible({
          timeout: 5000
        });
      }
      
      if (route.config.must_not_error !== false) {
        expect(consoleErrors).toHaveLength(0);
        expect(pageErrors).toHaveLength(0);
      }
      
      const smokeConfig = routeDiscovery.getConfig();
      const ignoreRules = smokeConfig.axe?.ignore || [];
      
      const accessibility = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .disableRules(ignoreRules)
        .analyze();
      
      const criticalViolations = accessibility.violations.filter(
        v => v.impact === 'critical' || v.impact === 'serious'
      );
      
      if (criticalViolations.length > 0) {
        console.log('Accessibility violations:', JSON.stringify(criticalViolations, null, 2));
      }
      expect(criticalViolations).toHaveLength(0);
      
      const evidencePath = path.join('.cache/evidence', `${route.path.replace(/\//g, '_')}.json`);
      const evidence = {
        route: route.path,
        url,
        consoleErrors,
        pageErrors,
        domSnapshot: await page.content(),
        timestamp: new Date().toISOString()
      };
      fs.writeFileSync(evidencePath, JSON.stringify(evidence, null, 2));
      
      if (route.config.demo_flow) {
        for (const step of route.config.demo_flow) {
          if (step.click) {
            await page.locator(step.click).click();
          }
          if (step.type) {
            await page.locator(step.type.selector).fill(step.type.text);
          }
          if (step.expect_text) {
            await expect(page.getByText(step.expect_text)).toBeVisible();
          }
        }
      }
    });
  }
});