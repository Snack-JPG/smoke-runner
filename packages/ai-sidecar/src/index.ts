export interface ProposedStep {
  action: 'click' | 'type' | 'expect_text' | 'expect_visible' | 'wait' | 'scroll';
  selector?: string;
  text?: string;
  timeout?: number;
  description?: string;
}

export interface Proposal {
  route: string;
  rationale: string[];
  steps: ProposedStep[];
  riskFlags: string[];
  confidence: number;
}

export interface Evidence {
  domSnapshot: string;
  consoleErrors: string[];
  networkErrors: string[];
  screenshotPath: string;
  diffSummary?: string;
  route: string;
  timestamp: string;
}

export interface Proposer {
  propose(evidence: Evidence): Promise<Proposal>;
}

export class DummyProposer implements Proposer {
  async propose(evidence: Evidence): Promise<Proposal> {
    const rationale: string[] = [];
    const steps: ProposedStep[] = [];
    const riskFlags: string[] = [];
    let confidence = 0.1;

    const dom = evidence.domSnapshot.toLowerCase();
    
    if (evidence.consoleErrors.length > 0) {
      rationale.push('Console errors detected, suggesting error handling verification');
      steps.push({
        action: 'expect_text',
        text: 'error',
        description: 'Verify error message is displayed'
      });
      riskFlags.push('console_errors_present');
      confidence += 0.3;
    }
    
    if (dom.includes('table') && dom.includes('tbody')) {
      const hasRows = dom.includes('<tr') && dom.match(/<tr/g)!.length > 1;
      if (!hasRows) {
        rationale.push('Empty table detected, checking for empty state');
        steps.push({
          action: 'expect_text',
          text: 'No data',
          description: 'Verify empty state message'
        });
        confidence += 0.2;
      } else {
        rationale.push('Table with data detected, checking pagination');
        if (dom.includes('next') || dom.includes('pagination')) {
          steps.push({
            action: 'click',
            selector: '[data-testid="next-page"], .pagination .next, button[aria-label*="next"]',
            description: 'Test pagination next button'
          });
          confidence += 0.4;
        }
      }
    }
    
    const createButtonRegex = /button[^>]*>(create|new|add|plus)/i;
    if (createButtonRegex.test(dom)) {
      rationale.push('Create/New button detected, testing creation flow');
      steps.push({
        action: 'click',
        selector: 'button:has-text("Create"), button:has-text("New"), button:has-text("Add"), [data-testid*="create"], [data-testid*="new"], [data-testid*="add"]',
        description: 'Click create/new button'
      });
      
      if (dom.includes('input') && dom.includes('type="text"')) {
        steps.push({
          action: 'type',
          selector: 'input[type="text"]:first, input[name*="name"]:first, input[name*="title"]:first',
          text: 'Test Item',
          description: 'Fill in main text field'
        });
      }
      
      const saveButtonRegex = /button[^>]*>(save|submit|create|confirm)/i;
      if (saveButtonRegex.test(dom)) {
        steps.push({
          action: 'click',
          selector: 'button:has-text("Save"), button:has-text("Submit"), button:has-text("Create"), button[type="submit"]',
          description: 'Submit the form'
        });
        
        steps.push({
          action: 'expect_text',
          text: 'created|saved|success',
          description: 'Verify success message'
        });
      }
      
      confidence += 0.5;
    }
    
    if (dom.includes('form')) {
      const requiredFields = (dom.match(/required/g) || []).length;
      if (requiredFields > 0) {
        rationale.push(`Form with ${requiredFields} required fields detected`);
        riskFlags.push('required_fields_present');
        confidence += 0.2;
      }
    }
    
    if (dom.includes('[data-testid') || dom.includes('data-testid=')) {
      rationale.push('Test IDs found, using stable selectors');
      confidence += 0.3;
    } else {
      rationale.push('No test IDs found, using less stable selectors');
      riskFlags.push('no_test_ids');
    }
    
    if (dom.includes('loading') || dom.includes('spinner')) {
      rationale.push('Loading states detected, adding wait steps');
      steps.unshift({
        action: 'wait',
        timeout: 2000,
        description: 'Wait for loading to complete'
      });
      confidence += 0.1;
    }
    
    if (evidence.networkErrors.length > 0) {
      rationale.push('Network errors detected in evidence');
      riskFlags.push('network_errors_present');
      confidence -= 0.2;
    }
    
    if (steps.length === 0) {
      rationale.push('No clear interactions detected, suggesting basic visibility check');
      steps.push({
        action: 'expect_visible',
        selector: 'main, .main-content, [data-testid="main"], body > div:first-child',
        description: 'Verify main content is visible'
      });
      confidence = 0.1;
    }
    
    if (evidence.diffSummary) {
      rationale.push('Git diff detected: ' + evidence.diffSummary.substring(0, 100) + '...');
      confidence += 0.2;
    }

    return {
      route: evidence.route,
      rationale,
      steps,
      riskFlags,
      confidence: Math.min(confidence, 1.0)
    };
  }
}

export class AIProposerInterface implements Proposer {
  private fallback = new DummyProposer();
  
  constructor(private modelProvider?: string) {}
  
  async propose(evidence: Evidence): Promise<Proposal> {
    console.warn('⚠️  AI Proposer not implemented yet, using dummy proposer');
    return this.fallback.propose(evidence);
  }
}

export { DummyProposer as DefaultProposer };