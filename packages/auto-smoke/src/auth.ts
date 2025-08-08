import { Page, BrowserContext } from '@playwright/test';
import { loadConfig } from './config';
import * as fs from 'fs';
import * as path from 'path';

export interface AuthConfig {
  mode: 'none' | 'cookie' | 'magic_link' | 'basic' | 'oauth_token';
  cookie?: string;
  magicLinkPath?: string;
  basicAuth?: {
    username: string;
    password: string;
  };
  oauthToken?: string;
  sessionFile?: string;
}

export class AuthManager {
  private config = loadConfig();
  private sessionPath = path.join(process.cwd(), '.cache/auth/session.json');

  constructor() {
    const authDir = path.dirname(this.sessionPath);
    if (!fs.existsSync(authDir)) {
      fs.mkdirSync(authDir, { recursive: true });
    }
  }

  async setupAuth(context: BrowserContext, authConfig?: AuthConfig): Promise<void> {
    const auth = authConfig || this.getAuthConfig();
    
    switch (auth.mode) {
      case 'cookie':
        await this.setupCookieAuth(context, auth);
        break;
      case 'magic_link':
        await this.setupMagicLinkAuth(context, auth);
        break;
      case 'basic':
        await this.setupBasicAuth(context, auth);
        break;
      case 'oauth_token':
        await this.setupOAuthToken(context, auth);
        break;
      case 'none':
      default:
        // No auth setup needed
        break;
    }
  }

  private getAuthConfig(): AuthConfig {
    return {
      mode: this.config.authMode as any,
      cookie: this.config.authCookie,
      magicLinkPath: this.config.magicLinkPath,
      basicAuth: {
        username: process.env.BASIC_AUTH_USERNAME || '',
        password: process.env.BASIC_AUTH_PASSWORD || ''
      },
      oauthToken: process.env.OAUTH_TOKEN,
      sessionFile: process.env.SESSION_FILE
    };
  }

  private async setupCookieAuth(context: BrowserContext, auth: AuthConfig): Promise<void> {
    if (!auth.cookie) {
      console.warn('⚠️  Cookie auth enabled but no AUTH_COOKIE provided');
      return;
    }

    const [name, value] = auth.cookie.split('=');
    if (!name || !value) {
      throw new Error('Invalid cookie format. Expected: name=value');
    }

    await context.addCookies([{
      name: name.trim(),
      value: value.trim(),
      domain: new URL(this.config.baseUrl).hostname,
      path: '/',
      httpOnly: true,
      secure: this.config.baseUrl.startsWith('https'),
      sameSite: 'Lax'
    }]);

    console.log(`🍪 Cookie auth configured: ${name}`);
  }

  private async setupMagicLinkAuth(context: BrowserContext, auth: AuthConfig): Promise<void> {
    if (!auth.magicLinkPath) {
      throw new Error('Magic link path required for magic_link auth mode');
    }

    const magicUrl = `${this.config.baseUrl}${auth.magicLinkPath}`;
    console.log(`🔗 Using magic link: ${magicUrl}`);

    // Create a temporary page to visit magic link
    const page = await context.newPage();
    try {
      await page.goto(magicUrl, { waitUntil: 'networkidle' });
      
      // Wait for redirect or auth completion
      await page.waitForTimeout(2000);
      
      // Check if we're logged in by looking for common auth indicators
      const isLoggedIn = await page.evaluate(() => {
        return document.cookie.includes('auth') || 
               document.cookie.includes('session') ||
               localStorage.getItem('token') !== null ||
               sessionStorage.getItem('token') !== null;
      });

      if (isLoggedIn) {
        console.log('✅ Magic link authentication successful');
        await this.saveSession(context);
      } else {
        console.warn('⚠️  Magic link may not have worked - no auth indicators found');
      }
    } finally {
      await page.close();
    }
  }

  private async setupBasicAuth(context: BrowserContext, auth: AuthConfig): Promise<void> {
    if (!auth.basicAuth?.username || !auth.basicAuth?.password) {
      throw new Error('Username and password required for basic auth mode');
    }

    await context.setHTTPCredentials({
      username: auth.basicAuth.username,
      password: auth.basicAuth.password
    });

    console.log(`🔐 Basic auth configured for user: ${auth.basicAuth.username}`);
  }

  private async setupOAuthToken(context: BrowserContext, auth: AuthConfig): Promise<void> {
    if (!auth.oauthToken) {
      throw new Error('OAuth token required for oauth_token auth mode');
    }

    // Add Authorization header to all requests
    await context.setExtraHTTPHeaders({
      'Authorization': `Bearer ${auth.oauthToken}`
    });

    console.log('🎫 OAuth token configured');
  }

  async saveSession(context: BrowserContext): Promise<void> {
    try {
      const storageState = await context.storageState();
      fs.writeFileSync(this.sessionPath, JSON.stringify(storageState, null, 2));
      console.log(`💾 Session saved to ${this.sessionPath}`);
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }

  async loadSession(context: BrowserContext): Promise<boolean> {
    try {
      if (fs.existsSync(this.sessionPath)) {
        const storageState = JSON.parse(fs.readFileSync(this.sessionPath, 'utf-8'));
        await context.addCookies(storageState.cookies || []);
        
        // Set localStorage items
        if (storageState.origins) {
          for (const origin of storageState.origins) {
            const page = await context.newPage();
            await page.goto(origin.origin);
            
            for (const item of origin.localStorage || []) {
              await page.evaluate(
                ({ name, value }) => localStorage.setItem(name, value),
                item
              );
            }
            
            await page.close();
          }
        }
        
        console.log('📂 Session restored from file');
        return true;
      }
    } catch (error) {
      console.warn('Failed to load session:', error);
    }
    
    return false;
  }

  async isAuthRequired(page: Page, url: string): Promise<boolean> {
    try {
      const response = await page.goto(url, { timeout: 10000 });
      const status = response?.status() || 0;
      
      // Check for common auth-related status codes and URLs
      if (status === 401 || status === 403) {
        return true;
      }
      
      const currentUrl = page.url();
      const authUrls = ['/login', '/signin', '/auth', '/authenticate'];
      
      return authUrls.some(authPath => 
        currentUrl.includes(authPath) && !url.includes(authPath)
      );
    } catch (error) {
      console.warn(`⚠️  Could not determine auth requirement for ${url}:`, error);
      return false;
    }
  }

  async skipAuthGatedRoutes(routes: any[]): Promise<any[]> {
    if (this.config.authMode === 'none') {
      console.log('🔓 Skipping auth-gated route detection (auth mode: none)');
      return routes;
    }

    const availableRoutes: any[] = [];
    
    for (const route of routes) {
      const url = `${this.config.baseUrl}${route.path}`;
      
      // Create a temporary context for auth checking
      const browser = require('@playwright/test').chromium;
      const tempContext = await browser.launch().then(b => b.newContext());
      const tempPage = await tempContext.newPage();
      
      try {
        const requiresAuth = await this.isAuthRequired(tempPage, url);
        
        if (requiresAuth) {
          console.log(`🔒 Skipping auth-gated route: ${route.path}`);
        } else {
          availableRoutes.push(route);
        }
      } catch (error) {
        console.warn(`⚠️  Error checking ${route.path}, including it anyway`);
        availableRoutes.push(route);
      } finally {
        await tempPage.close();
        await tempContext.close();
      }
    }
    
    return availableRoutes;
  }
}