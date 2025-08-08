#!/usr/bin/env node

import { Command } from 'commander';
import { DummyProposer, Evidence, Proposal } from './index';
import * as fs from 'fs';
import * as path from 'path';

const program = new Command();

program
  .name('ai-sidecar')
  .description('AI-powered test step proposer for smoke tests')
  .version('1.0.0');

program
  .command('propose')
  .description('Generate test proposals based on evidence')
  .option('--route <route>', 'Route to generate proposals for')
  .option('--evidence <path>', 'Path to evidence JSON file')
  .option('--output <path>', 'Output path for proposals (default: stdout)')
  .action(async (options) => {
    try {
      const evidencePath = options.evidence;
      
      if (!evidencePath || !fs.existsSync(evidencePath)) {
        console.error('❌ Evidence file not found:', evidencePath);
        process.exit(1);
      }

      const evidenceData: Evidence = JSON.parse(fs.readFileSync(evidencePath, 'utf-8'));
      
      if (options.route && evidenceData.route !== options.route) {
        console.error(`❌ Route mismatch: expected ${options.route}, got ${evidenceData.route}`);
        process.exit(1);
      }

      const proposer = new DummyProposer();
      const proposal = await proposer.propose(evidenceData);

      const output = JSON.stringify(proposal, null, 2);

      if (options.output) {
        const outputDir = path.dirname(options.output);
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }
        fs.writeFileSync(options.output, output);
        console.log(`✅ Proposal written to ${options.output}`);
      } else {
        console.log(output);
      }

    } catch (error) {
      console.error('❌ Failed to generate proposal:', error);
      process.exit(1);
    }
  });

program
  .command('batch')
  .description('Generate proposals for all evidence files in a directory')
  .option('--evidence-dir <path>', 'Directory containing evidence files', '.cache/evidence')
  .option('--output-dir <path>', 'Output directory for proposals', './proposals')
  .action(async (options) => {
    try {
      const evidenceDir = options.evidenceDir;
      const outputDir = options.outputDir;

      if (!fs.existsSync(evidenceDir)) {
        console.error('❌ Evidence directory not found:', evidenceDir);
        process.exit(1);
      }

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const evidenceFiles = fs.readdirSync(evidenceDir)
        .filter(file => file.endsWith('.json'));

      if (evidenceFiles.length === 0) {
        console.log('ℹ️  No evidence files found in', evidenceDir);
        return;
      }

      const proposer = new DummyProposer();
      let processedCount = 0;

      console.log(`🔍 Processing ${evidenceFiles.length} evidence files...`);

      for (const file of evidenceFiles) {
        const evidencePath = path.join(evidenceDir, file);
        const evidenceData: Evidence = JSON.parse(fs.readFileSync(evidencePath, 'utf-8'));
        
        const proposal = await proposer.propose(evidenceData);
        
        const outputFileName = file.replace('.json', '.proposal.json');
        const outputPath = path.join(outputDir, outputFileName);
        
        fs.writeFileSync(outputPath, JSON.stringify(proposal, null, 2));
        processedCount++;
        
        console.log(`✅ ${evidenceData.route} → ${outputFileName} (confidence: ${(proposal.confidence * 100).toFixed(1)}%)`);
      }

      console.log(`\n🎉 Generated ${processedCount} proposals in ${outputDir}`);

    } catch (error) {
      console.error('❌ Failed to generate batch proposals:', error);
      process.exit(1);
    }
  });

if (require.main === module) {
  program.parse();
}