<div align="center">

# 🔥 **SMOKE RUNNER**

**The Ultimate Open-Source Automated Testing Powerhouse**

*Discover. Test. Report. Evolve.*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Powered%20by-Playwright-orange.svg)](https://playwright.dev/)

**Smoke Runner** is the next-generation automated smoke testing tool that transforms how you validate web applications. Built for the modern web, it automatically discovers your routes, runs comprehensive tests, and uses AI to evolve your testing strategy.

[🚀 **Get Started**](#-quick-start) • [📖 **Documentation**](#-comprehensive-guide) • [🤖 **AI Features**](#-ai-powered-testing) • [🔮 **Coming Soon**](#-whats-coming-next)

</div>

---

## 🌟 **Why Smoke Runner?**

<table>
<tr>
<td width="50%">

### **🧠 Intelligent Discovery**
- **Smart Route Detection**: Automatically finds all your Next.js routes
- **Dynamic Route Handling**: Supports parameterized routes with sample data
- **Framework Agnostic**: Built to expand beyond Next.js

### **🔒 Enterprise-Ready Security**
- **Multi-Auth Support**: Cookie, magic link, basic auth, OAuth tokens
- **Session Management**: Automatic auth state detection
- **Secure by Default**: Never logs or exposes sensitive data

### **🚀 Performance First**
- **Lighthouse Integration**: Core Web Vitals monitoring
- **Parallel Execution**: Configurable concurrency for faster testing
- **Resource Optimization**: Smart caching and memory management

</td>
<td width="50%">

### **🤖 AI-Powered Evolution**
- **Smart Test Suggestions**: AI analyzes your DOM for test opportunities
- **Risk Assessment**: Confidence scoring and risk flags
- **Adaptive Learning**: Evolves based on your application patterns

### **📊 Production Insights**
- **Rich Reporting**: Beautiful Markdown reports with screenshots
- **Slack/Teams Integration**: Real-time notifications
- **CI/CD Native**: GitHub Actions workflows included

### **🛠️ Developer Experience**
- **Zero Configuration**: Works out of the box
- **File Watching**: Development mode with live reloading
- **Extensible**: Plugin architecture for custom needs

</td>
</tr>
</table>

## 🏗️ **Architecture Overview**

<div align="center">

```
                    ┌─────────────────────────────────────────┐
                    │           🔥 SMOKE RUNNER               │
                    │         Control Center                  │
                    └─────────────┬───────────────────────────┘
                                  │
                    ┌─────────────┴───────────────┬───────────┐
                    │                             │           │
          ┌─────────▼──────────┐       ┌─────────▼──────┐   │
          │  🧪 AUTO-SMOKE     │       │  🤖 AI-SIDECAR │   │
          │  Testing Engine    │       │  Smart Assist  │   │
          │                    │       │                │   │
          │ • Route Discovery  │◄──────┤ • DOM Analysis │   │
          │ • Playwright Tests │       │ • Test Proposals│   │
          │ • Accessibility    │       │ • Risk Assessment│  │
          │ • Performance      │       │ • Confidence Score│ │
          │ • Visual Regression│       └────────────────┘   │
          └────────────────────┘                            │
                    │                                       │
          ┌─────────▼──────────┐       ┌─────────────────────▼┐
          │  📊 REPORTING      │       │  🌱 TEST DATA       │
          │                    │       │                     │
          │ • Markdown Reports │       │ • Database Seeding  │
          │ • Slack Integration│       │ • Multi-DB Support  │
          │ • CI/CD Artifacts  │       │ • Cleanup Automation│
          └────────────────────┘       └─────────────────────┘
```

</div>

## 🚀 **Quick Start Guide**

<div align="center">

### **Get up and running in 60 seconds!** ⏱️

</div>

<table>
<tr>
<td width="50%">

### **📋 Prerequisites**
```bash
✅ Node.js 18+
✅ pnpm (recommended) or npm  
✅ Next.js app (any version)
✅ 5 minutes of your time
```

### **⚡ Lightning Setup**
```bash
# 1. Clone the power
git clone https://github.com/Snack-JPG/smoke-runner.git
cd smoke-runner

# 2. Install dependencies
pnpm install

# 3. Install Playwright browsers
pnpm exec playwright install --with-deps

# 4. Configure for your app
cp .env.example .env
cp .smoke.yml.example .smoke.yml
```

</td>
<td width="50%">

### **🎯 Test Your App**
```bash
# Point to your app
echo "BASE_URL=http://localhost:3000" > .env

# Run your first smoke test
pnpm smoke:dev

# Watch the magic happen! ✨
```

### **🔥 Pro Mode**
```bash
# Visual regression testing
VISUAL=1 pnpm smoke:visual

# Performance auditing
pnpm smoke:lhci

# AI-powered suggestions
pnpm ai:propose
```

</td>
</tr>
</table>

### **🎨 Enhance Your App (Optional but Recommended)**

Add `data-testid` attributes for rock-solid testing:

```jsx
// Before: Fragile selectors
<nav className="top-nav">
  <button className="cta btn-primary">Sign Up</button>
</nav>

// After: Bulletproof testing
<nav data-testid="navigation" className="top-nav">
  <button data-testid="cta-button" className="cta btn-primary">Sign Up</button>
</nav>
```

---

## 📖 **Comprehensive Guide**

### **⚙️ Environment Configuration**

<details>
<summary>🔧 <strong>Click to expand .env configuration</strong></summary>

```bash
# 🎯 Application Settings
BASE_URL=http://localhost:3000              # Your app URL
PROJECT_ROOT=./app                          # Path to your Next.js app
DEV_START=pnpm dev                          # Command to start your app

# 🚀 Performance Tuning
SMOKE_CONCURRENCY=4                         # Parallel browser instances
ROUTE_LIMIT=20                              # Max routes to test (0 = unlimited)
TIMEOUT=30000                               # Test timeout in milliseconds
RETRIES=2                                   # Retry count for flaky tests

# 🔐 Authentication (Pick Your Fighter)
AUTH_MODE=none                              # none|cookie|magic_link|basic|oauth_token

# 🍪 Cookie Auth
AUTH_COOKIE=sessionToken=abc123; Path=/     # Session cookie for auth

# 🔗 Magic Link Auth  
MAGIC_LINK_PATH=/auth/magic?token=test123   # Direct auth URL path

# 🔑 Basic Auth
BASIC_AUTH_USERNAME=testuser                # HTTP basic auth username
BASIC_AUTH_PASSWORD=secret123               # HTTP basic auth password

# 🎫 OAuth Token Auth
OAUTH_TOKEN=Bearer_your_token_here          # Authorization header token

# 🖼️ Visual Testing
VISUAL=false                                # Enable visual regression testing

# 📊 Reporting & Notifications
SMOKE_SLACK_WEBHOOK=https://hooks.slack.com/...  # Slack webhook for notifications

# 🌱 Test Data Management
DB_TYPE=prisma                              # Database type for seeding
DATABASE_URL=postgresql://localhost:5432/test    # Database connection
SUPABASE_URL=https://your-project.supabase.co    # Supabase project URL
SUPABASE_ANON_KEY=your_anon_key             # Supabase anonymous key

# 🔄 CI/CD Integration
LHCI_GITHUB_APP_TOKEN=ghp_token             # Lighthouse CI GitHub integration
VERCEL_TOKEN=your_vercel_token              # Vercel API token
VERCEL_PROJECT_ID=your_project_id           # Vercel project ID
```

</details>

### **📝 Route Configuration (.smoke.yml)**

<details>
<summary>⚙️ <strong>Click to expand route configuration examples</strong></summary>

```yaml
# 🎯 Global defaults for all routes
defaults:
  must_exist:
    - 'main'                                # Every page needs main content
    - '[data-testid="navigation"]'          # And navigation
  must_not_error: true                      # No console errors allowed

# 🔐 Authentication configuration
auth:
  mode: 'cookie'                            # Choose: none|cookie|magic_link|basic|oauth_token
  cookie: 'sessionToken=test-value'         # Your test session

# 🎪 Accessibility rules
axe:
  ignore:
    - 'color-contrast'                      # Ignore during development
    - 'duplicate-id'                        # Ignore specific violations

# 🖼️ Visual regression settings
visual:
  enabled: true                             # Enable visual testing
  threshold: 0.2                            # Pixel difference tolerance

# 🗺️ Route-specific configurations
routes:
  # 🏠 Homepage with interaction flow
  '/':
    must_exist:
      - '[data-testid="hero-section"]'
      - '[data-testid="cta-button"]'
    demo_flow:
      - click: '[data-testid="cta-button"]'
      - expect_text: 'Welcome'

  # 📊 Dashboard with complex workflow
  '/dashboard':
    must_exist:
      - '[data-testid="dashboard-header"]'
      - '[data-testid="stats-widget"]'
    demo_flow:
      - click: '[data-testid="create-button"]'
      - type:
          selector: '[data-testid="name-input"]'
          text: 'Test Project'
      - click: '[data-testid="save-button"]'
      - expect_text: 'Project created successfully'

  # 👤 Dynamic user profile routes
  '/user/[id]':
    sample_params:
      id: '123'                             # Tests /user/123
    must_exist:
      - '[data-testid="user-avatar"]'
      - '[data-testid="user-name"]'

  # 🛍️ E-commerce product page
  '/products/[slug]':
    sample_params:
      slug: 'awesome-product'
    demo_flow:
      - click: '[data-testid="add-to-cart"]'
      - expect_text: 'Added to cart'
      - click: '[data-testid="cart-icon"]'

  # 📝 Contact form testing
  '/contact':
    demo_flow:
      - type:
          selector: '[data-testid="name-input"]'
          text: 'Test User'
      - type:
          selector: '[data-testid="email-input"]'
          text: 'test@example.com'
      - type:
          selector: '[data-testid="message-input"]'
          text: 'This is a test message from Smoke Runner!'
      - click: '[data-testid="submit-button"]'
      - expect_text: 'Thank you for your message'
```

</details>

### **🤖 AI-Powered Testing**

<div align="center">

**The Future of Testing is Here** 🚀

*Smoke Runner's AI analyzes your DOM, detects patterns, and suggests intelligent test scenarios*

</div>

```bash
# Generate AI proposals for all your routes
pnpm ai:propose

# View the magic
cat proposals/*.proposal.json
```

**What the AI Looks For:**

<table>
<tr>
<td width="50%">

🎯 **Smart Pattern Detection**
- Forms with required fields
- Navigation menus and links
- Interactive buttons and CTAs
- Loading states and spinners
- Empty states and error conditions

🧠 **Intelligent Suggestions**
- Form filling with realistic data
- Multi-step workflow testing
- Error handling validation
- Accessibility improvements
- Performance optimizations

</td>
<td width="50%">

📊 **Risk Assessment**
- Confidence scoring (0-1)
- Risk flags for complex flows
- Stability indicators
- Maintenance predictions

🔮 **Example AI Proposal**
```json
{
  "route": "/checkout",
  "confidence": 0.85,
  "rationale": [
    "Multi-step form detected",
    "Required fields: email, address",
    "Payment integration present"
  ],
  "steps": [
    {
      "action": "type",
      "selector": "[data-testid='email']",
      "text": "test@example.com"
    }
  ],
  "riskFlags": ["payment_flow", "required_fields"]
}
```

</td>
</tr>
</table>

---

## 💻 **Usage Patterns**

Start the file watcher for continuous testing:

```bash
pnpm smoke:dev
```

This will:
1. Start your app (if `DEV_START` is configured)
2. Wait for it to be ready at `BASE_URL`
3. Discover and test all routes
4. Watch for file changes and re-run tests
5. Generate markdown reports with results

### Individual Commands

```bash
# Run smoke tests only
pnpm smoke:test

# Run visual regression tests
pnpm smoke:visual

# Run Lighthouse CI
pnpm smoke:lhci

# Generate AI proposals
pnpm ai:propose batch --evidence-dir .cache/evidence --output-dir ./proposals
```

### Testing Specific Routes

Use the route limit to test a subset:

```bash
ROUTE_LIMIT=5 pnpm smoke:test
```

Or configure specific routes in `.smoke.yml`:

```yaml
routes:
  "/": {}
  "/dashboard": {}
  "/reports": {}
```

## Test Types

### Basic Smoke Tests

Every route gets:
- ✅ HTTP 200 status check
- ✅ Main content visibility (`main` element)
- ✅ Console error detection
- ✅ Page error detection
- ✅ Critical accessibility violations (Axe)

### Navigation Tests

- ✅ Top navigation links (`[data-testid="top-nav"] a`)
- ✅ Tab navigation (`[data-testid^="tab-"]`)
- ✅ Route content verification after navigation

### Demo Flows

Configure custom user interactions per route:

```yaml
routes:
  "/reports":
    demo_flow:
      - click: "button[data-testid='create-report']"
      - type: 
          selector: "input[name='name']"
          text: "Test Report"
      - click: "button[type='submit']"
      - expect_text: "Report created successfully"
```

### Visual Regression

Enable with `VISUAL=1`:

```bash
VISUAL=1 pnpm smoke:visual
```

Screenshots stored in `packages/auto-smoke/__screenshots__/` with automatic baseline management.

## AI Proposals

The AI sidecar analyzes your application and proposes additional test steps:

```bash
# Generate proposals for all routes
pnpm ai:propose batch

# Generate proposal for specific route
pnpm ai:propose --route /dashboard --evidence .cache/evidence/dashboard.json
```

Example proposal:
```json
{
  "route": "/reports",
  "rationale": [
    "Create button detected, testing creation flow",
    "Form with 2 required fields detected"
  ],
  "steps": [
    {
      "action": "click",
      "selector": "button:has-text('Create')",
      "description": "Click create button"
    },
    {
      "action": "type", 
      "selector": "input[name='title']",
      "text": "Test Report",
      "description": "Fill in title field"
    }
  ],
  "riskFlags": ["required_fields_present"],
  "confidence": 0.8
}
```

## Authentication

### Cookie-based Auth

```yaml
# .smoke.yml
auth:
  mode: "cookie"
  cookie: "__session=your-test-session-token"
```

### Magic Link Auth

```yaml
# .smoke.yml  
auth:
  mode: "magic_link"
  magic_link_path: "/auth/test-login"
```

### Programmatic Auth

For complex auth flows, seed test data:

```bash
tsx scripts/seedTestData.ts seed
```

## CI/CD Integration

### GitHub Actions

The included workflow (`.github/workflows/auto-smoke.yml`):

1. ⏳ Waits for Vercel preview deployment
2. 🧪 Runs smoke tests against preview URL
3. 📊 Runs Lighthouse performance audit
4. 🤖 Generates AI proposals for new/changed routes
5. 📄 Posts results as PR comment
6. 📦 Uploads artifacts (reports, screenshots)

### Environment Variables for CI

Set these in your repository secrets:

- `VERCEL_PREVIEW_URL` - Override automatic Vercel detection
- `SMOKE_SLACK_WEBHOOK` - Slack notifications for test results

### Vercel Integration

The workflow automatically detects Vercel preview URLs. For manual override:

```yaml
env:
  VERCEL_PREVIEW_URL: https://your-preview-deployment.vercel.app
```

## Data Testids

Add these to your components for more stable tests:

```tsx
// Navigation
<nav data-testid="top-nav">
  <a href="/dashboard">Dashboard</a>
</nav>

// Tabs  
<div data-testid="tab-overview">Overview</div>
<div data-testid="tab-settings">Settings</div>

// Page content
<main>
  <h1 data-testid="page-title">Dashboard</h1>
</main>

// Interactive elements
<button data-testid="create-report">Create Report</button>
<input data-testid="report-name" name="name" />
```

## Troubleshooting

### Tests Timing Out

Increase timeout values:

```bash
TIMEOUT=60000 pnpm smoke:test
```

### Auth-Gated Routes Failing

Configure authentication in `.smoke.yml` or routes will be skipped with warnings.

### Dynamic Routes Not Found

Add sample parameters:

```yaml
routes:
  "/users/[id]":
    sample_params:
      id: "test-user-123"
```

### Flaky Visual Tests

Increase threshold or disable animations:

```yaml
visual:
  enabled: true
  threshold: 0.3  # More tolerant
```

### Missing Routes

Check file patterns match your structure:
- Next.js App Router: `app/**/page.{tsx,jsx,ts,js}`  
- Next.js Pages Router: `pages/**/*.{tsx,jsx,ts,js}`

### Performance Budget Failures

Adjust Lighthouse budgets in `packages/auto-smoke/lighthouserc.json`:

```json
{
  "assertions": {
    "categories:performance": ["error", {"minScore": 0.7}],
    "largest-contentful-paint": ["error", {"maxNumericValue": 5000}]
  }
}
```

## Reporting

### Markdown Reports

Generated at `./smoke-report.md` with:

- ✅ Pass/fail summary  
- ❌ Failed routes with errors
- 🔍 Top accessibility issues
- 📊 Lighthouse scores
- 🖼️ Links to screenshots and detailed reports

### Slack Integration

Set `SMOKE_SLACK_WEBHOOK` to get notifications:

```bash
SMOKE_SLACK_WEBHOOK=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
```

### Artifacts

- `playwright-report/` - Interactive Playwright HTML report
- `__screenshots__/` - Visual regression baselines and diffs
- `test-results/` - Raw test output and videos
- `proposals/` - AI-generated test proposals

## Extending

### Custom Test Steps

Add to your routes in `.smoke.yml`:

```yaml
routes:
  "/custom":
    demo_flow:
      - click: "[data-testid='custom-button']"
      - wait: 1000
      - expect_visible: ".success-message"
      - scroll: "[data-testid='bottom-section']"
```

### Custom Proposers  

Implement the `Proposer` interface:

```typescript
import { Proposer, Evidence, Proposal } from '@smoke-runner/ai-sidecar';

class CustomProposer implements Proposer {
  async propose(evidence: Evidence): Promise<Proposal> {
    // Your custom logic here
    return {
      route: evidence.route,
      steps: [],
      rationale: [],
      riskFlags: [],
      confidence: 0.5
    };
  }
}
```

### Custom Reporters

Extend `MarkdownReporter`:

```typescript
import { MarkdownReporter } from '@smoke-runner/auto-smoke';

class CustomReporter extends MarkdownReporter {
  generateReport(data: ReportData): string {
    // Custom report format
    return super.generateReport(data) + '\n## Custom Section\n...';
  }
}
```

---

## 🔮 **What's Coming Next**

<div align="center">

### **The Future of Automated Testing is Being Built** 

*We're not just building a testing tool—we're crafting the future of web development workflow.*

</div>

<table>
<tr>
<td width="50%">

### **🧠 Real AI Integration** 
*Coming Soon*

**🎯 Features:**
- **OpenAI/Claude Integration**: Replace dummy proposer with real AI
- **Semantic Field Detection**: Smart form field recognition  
- **Natural Language Tests**: Write tests in plain English
- **Self-Healing Selectors**: Auto-fix broken test selectors

**🚀 Impact:**
```bash
# Write tests like this:
smoke add-test "Fill out the contact form and submit it"
smoke add-test "Test the checkout flow with valid payment"

# AI figures out the implementation!
```

</td>
<td width="50%">

### **🌐 Framework Expansion**
*Coming Soon*

**🎯 Features:**
- **React**: Full React app support beyond Next.js
- **Vue.js**: Component-level testing and routing
- **Svelte/SvelteKit**: Blazing fast testing for blazing fast apps
- **Angular**: Enterprise-grade testing automation

**🔥 Multi-Framework Projects:**
```bash
smoke detect-framework
# Auto-detects: Next.js + React + Vue microfrontends
# Configures appropriate testing strategies
```

</td>
</tr>
<tr>
<td width="50%">

### **⚡ Performance Revolution**
*Coming Soon*

**🎯 Features:**
- **Distributed Testing**: Run tests across multiple machines
- **Smart Test Parallelization**: AI-optimized test distribution
- **Resource Monitoring**: Real-time performance insights
- **Test Optimization**: Auto-optimize slow tests

**📊 Performance Insights:**
```bash
# Get real-time insights
smoke analyze performance
# AI suggests: "Optimize /dashboard - 40% slower than baseline"
```

</td>
<td width="50%">

### **🔄 DevOps Integration**
*Coming 2025*

**🎯 Features:**
- **Kubernetes Testing**: Test in production-like environments  
- **Database Versioning**: Schema-aware test data management
- **Feature Flag Testing**: Test different feature combinations
- **Monitoring Integration**: Connect to DataDog, NewRelic, etc.

**🎪 Full Pipeline:**
```bash
# Complete DevOps workflow
smoke pipeline create
# Sets up: staging → testing → production deployment
```

</td>
</tr>
</table>

### **🎯 The Grand Vision**

<div align="center">

```
    BUILD → SMOKE → FIX → IDEA → REPEAT
         ↗               ↙
    🤖 AI ORCHESTRATOR 🤖
    (Private Beta - 2025)
```

**The Ultimate Development Loop**
- **Automated Building**: Trigger builds on code changes
- **Instant Smoke Testing**: Test every build automatically  
- **Intelligent Fixing**: AI suggests fixes for failures
- **Continuous Innovation**: AI proposes new features based on usage patterns

*This is the future we're building toward—a world where your apps evolve themselves.*

</div>

---

## 🤝 **Join the Revolution**

<div align="center">

### **We're Building This Together**

**Smoke Runner** is open source because the best tools are built by the community, for the community.

</div>

<table>
<tr>
<td width="33%">

### **🛠️ Contributors**
- **Code Contributors**: Shape the future of testing
- **Documentation Heroes**: Help others get started
- **Bug Hunters**: Make it bulletproof
- **Feature Visionaries**: Suggest what's next

[**Start Contributing →**](CONTRIBUTING.md)

</td>
<td width="33%">

### **💬 Community**
- **GitHub Discussions**: Share ideas and get help
- **Discord**: Real-time community chat
- **Blog**: Deep dives and tutorials

[**Join Discord →**](#)

</td>
<td width="33%">

### **🚀 Early Access**
- **Beta Testing**: Try new features first
- **Feature Voting**: Help prioritize development
- **Direct Access**: Chat with the core team
- **Special Recognition**: Hall of fame for contributors

[**Get Early Access →**](#)

</td>
</tr>
</table>

---

## 📄 **License & Acknowledgments**

<div align="center">

**MIT License** - Built with ❤️ for the developer community

*Special thanks to the incredible open-source projects that make Smoke Runner possible:*

[**Playwright**](https://playwright.dev/) • [**Axe**](https://github.com/dequelabs/axe-core) • [**Lighthouse**](https://github.com/GoogleChrome/lighthouse) • [**Next.js**](https://nextjs.org/)

</div>

---

<div align="center">

# **Ready to Transform Your Testing?**

### **Get started in 60 seconds and never look back** ⚡

```bash
git clone https://github.com/Snack-JPG/smoke-runner.git
cd smoke-runner && pnpm install
pnpm smoke:dev
```

### **The future of web development starts now.** 🚀

[⭐ **Star us on GitHub**](https://github.com/Snack-JPG/smoke-runner) • [🐦 **Follow for Updates**](https://twitter.com/smokerunner) • [💬 **Join Discord**](#)

---

*Built by developers, for developers. Made with* 🔥 *by [Snack](https://github.com/Snack-JPG)*

</div>
