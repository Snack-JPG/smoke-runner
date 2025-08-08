import { test, expect } from '@playwright/test';
import { loadConfig } from '../src/config';

const config = loadConfig();

test.describe('Navigation Tests', () => {
  test('Top navigation links work', async ({ page }) => {
    await page.goto(config.baseUrl, { waitUntil: 'networkidle' });
    
    const topNav = page.locator('[data-testid="top-nav"]');
    const navExists = await topNav.count() > 0;
    
    if (!navExists) {
      test.skip();
      return;
    }
    
    const links = topNav.locator('a');
    const linkCount = await links.count();
    const maxLinksToTest = Math.min(linkCount, 5);
    
    for (let i = 0; i < maxLinksToTest; i++) {
      const link = links.nth(i);
      const href = await link.getAttribute('href');
      const linkText = await link.textContent();
      
      if (!href || href === '#' || href.startsWith('javascript:')) {
        continue;
      }
      
      await link.click();
      await page.waitForLoadState('networkidle');
      
      const mainContent = page.locator('main').first();
      await expect(mainContent).toBeVisible({
        timeout: 5000
      });
      
      console.log(`✓ Navigated to ${linkText} (${href})`);
    }
  });

  test('Tab navigation works', async ({ page }) => {
    await page.goto(config.baseUrl, { waitUntil: 'networkidle' });
    
    const tabs = page.locator('[data-testid^="tab-"]');
    const tabCount = await tabs.count();
    
    if (tabCount === 0) {
      test.skip();
      return;
    }
    
    const maxTabsToTest = Math.min(tabCount, 5);
    
    for (let i = 0; i < maxTabsToTest; i++) {
      const tab = tabs.nth(i);
      const tabName = await tab.getAttribute('data-testid');
      
      await tab.click();
      await page.waitForTimeout(500);
      
      const isActive = await tab.evaluate(el => {
        return el.classList.contains('active') || 
               el.getAttribute('aria-selected') === 'true' ||
               el.getAttribute('data-state') === 'active';
      });
      
      expect(isActive).toBeTruthy();
      console.log(`✓ Tab ${tabName} activated`);
    }
  });
});