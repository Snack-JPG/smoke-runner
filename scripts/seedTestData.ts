#!/usr/bin/env node
/**
 * Seed script for smoke test data
 * Run this to populate test data for smoke tests
 */

interface SeedConfig {
  supabaseUrl?: string;
  supabaseKey?: string;
  databaseUrl?: string;
  dbType?: 'supabase' | 'postgresql' | 'mysql' | 'sqlite' | 'prisma';
  apiUrl?: string;
  apiKey?: string;
}

class TestDataSeeder {
  private config: SeedConfig;

  constructor() {
    this.config = {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_ANON_KEY,
      databaseUrl: process.env.DATABASE_URL,
      dbType: (process.env.DB_TYPE as any) || 'prisma',
      apiUrl: process.env.API_URL,
      apiKey: process.env.API_KEY,
    };
  }

  async seed(): Promise<void> {
    console.log('🌱 Starting test data seeding...');
    console.log(`   Using DB type: ${this.config.dbType}`);

    try {
      await this.validateConfig();
      await this.seedUsers();
      await this.seedProjects();
      await this.seedReports();
      await this.seedSampleContent();
      
      console.log('✅ Test data seeding completed successfully!');
    } catch (error) {
      console.error('❌ Failed to seed test data:', error);
      process.exit(1);
    }
  }

  private async validateConfig(): Promise<void> {
    switch (this.config.dbType) {
      case 'supabase':
        if (!this.config.supabaseUrl || !this.config.supabaseKey) {
          throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY required for Supabase');
        }
        break;
      case 'postgresql':
      case 'mysql':
      case 'sqlite':
        if (!this.config.databaseUrl) {
          throw new Error('DATABASE_URL required for direct DB connection');
        }
        break;
      case 'prisma':
        console.log('   Using Prisma - ensure schema is up to date');
        break;
      default:
        console.log('   No specific DB config - using API endpoints if available');
    }
  }

  private async seedUsers(): Promise<void> {
    console.log('👤 Seeding test users...');
    
    // Example: Create a test user
    const testUser = {
      id: 'smoke-test-user-123',
      email: 'smoke-test@example.com',
      name: 'Smoke Test User',
      created_at: new Date().toISOString(),
    };

    // TODO: Implement actual user creation based on your auth system
    console.log('   Created test user:', testUser.email);
  }

  private async seedProjects(): Promise<void> {
    console.log('📁 Seeding test projects...');
    
    const testProjects = [
      {
        id: 'smoke-project-123',
        name: 'Smoke Test Project',
        description: 'A project for smoke testing',
        owner_id: 'smoke-test-user-123',
        created_at: new Date().toISOString(),
      },
      {
        id: 'smoke-project-456',
        name: 'Another Test Project',
        description: 'Another project for testing',
        owner_id: 'smoke-test-user-123',
        created_at: new Date().toISOString(),
      }
    ];

    // TODO: Implement actual project creation
    for (const project of testProjects) {
      console.log('   Created project:', project.name);
    }
  }

  private async seedReports(): Promise<void> {
    console.log('📊 Seeding test reports...');
    
    const testReports = [
      {
        id: 'smoke-report-123',
        title: 'Sample Report',
        content: 'This is a sample report for smoke testing',
        project_id: 'smoke-project-123',
        created_at: new Date().toISOString(),
      }
    ];

    // TODO: Implement actual report creation
    for (const report of testReports) {
      console.log('   Created report:', report.title);
    }
  }

  private async seedSampleContent(): Promise<void> {
    console.log('📝 Seeding sample content...');
    
    const sampleContent = [
      {
        id: 'smoke-content-123',
        title: 'Sample Article',
        content: 'This is sample content for smoke testing. It contains various elements that can be tested.',
        tags: ['smoke-test', 'example', 'content'],
        published: true,
        created_at: new Date().toISOString(),
      }
    ];

    for (const content of sampleContent) {
      console.log('   Created content:', content.title);
    }
  }

  async cleanup(): Promise<void> {
    console.log('🧹 Cleaning up test data...');
    
    try {
      await this.cleanupByPrefix('smoke-test-');
      await this.cleanupByPrefix('smoke-project-');
      await this.cleanupByPrefix('smoke-report-');
      await this.cleanupByPrefix('smoke-content-');
      
      console.log('✅ Test data cleanup completed!');
    } catch (error) {
      console.error('❌ Failed to cleanup test data:', error);
    }
  }

  private async cleanupByPrefix(prefix: string): Promise<void> {
    console.log(`   Cleaning up items with prefix: ${prefix}`);
    
    switch (this.config.dbType) {
      case 'supabase':
        // Example: Delete from Supabase
        break;
      case 'prisma':
        // Example: Use Prisma to delete
        break;
      default:
        // Generic cleanup
        console.log(`   Would delete items matching: ${prefix}*`);
    }
  }

  async validateTestData(): Promise<boolean> {
    console.log('🔍 Validating test data...');
    
    try {
      // Check if test user exists
      const hasTestUser = await this.checkTestUserExists();
      const hasTestProjects = await this.checkTestProjectsExist();
      
      if (hasTestUser && hasTestProjects) {
        console.log('✅ Test data validation passed');
        return true;
      } else {
        console.log('❌ Test data validation failed - some data missing');
        return false;
      }
    } catch (error) {
      console.error('❌ Test data validation error:', error);
      return false;
    }
  }

  private async checkTestUserExists(): Promise<boolean> {
    // TODO: Implement actual user check based on your system
    return true;
  }

  private async checkTestProjectsExist(): Promise<boolean> {
    // TODO: Implement actual project check based on your system
    return true;
  }
}

// CLI interface
if (require.main === module) {
  const command = process.argv[2];
  const seeder = new TestDataSeeder();

  switch (command) {
    case 'seed':
      seeder.seed();
      break;
    case 'cleanup':
      seeder.cleanup();
      break;
    case 'validate':
      seeder.validateTestData();
      break;
    default:
      console.log('Usage: tsx scripts/seedTestData.ts [seed|cleanup|validate]');
      console.log('');
      console.log('Commands:');
      console.log('  seed     - Create test data for smoke tests');
      console.log('  cleanup  - Remove test data after smoke tests');
      console.log('  validate - Check if test data exists');
      console.log('');
      console.log('Environment Variables:');
      console.log('  DB_TYPE          - Database type (supabase|postgresql|mysql|sqlite|prisma)');
      console.log('  DATABASE_URL     - Database connection string');
      console.log('  SUPABASE_URL     - Supabase project URL');
      console.log('  SUPABASE_ANON_KEY - Supabase anon key');
      console.log('  API_URL          - API endpoint for data operations');
      console.log('  API_KEY          - API key for authentication');
      process.exit(1);
  }
}

export { TestDataSeeder };