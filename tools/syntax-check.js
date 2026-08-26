#!/usr/bin/env node

/**
 * Syntax Check Tool
 * Validates TypeScript/JavaScript syntax across the project
 * 
 * Best Practices Applied:
 * - Uses project-local tsc for consistency
 * - Proper error handling with clear messages
 * - Cross-platform path resolution
 * - Exit codes for CI/CD integration
 */

import { execFileSync } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import process from 'process';

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('🔍 Running syntax check...\n');

try {
  // Resolve tsc path
  const tscPath = resolve(__dirname, '..', 'node_modules', 'typescript', 'bin', 'tsc');
  
  // Run TypeScript compiler with noEmit
  execFileSync(
    'node',
    [tscPath, '--noEmit', '--skipLibCheck'],
    {
      cwd: resolve(__dirname, '..'),
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'development'
      }
    }
  );
  
  console.log('✅ Syntax check passed!\n');
  process.exit(0);
} catch (error) {
  const exitCode = error.status || 1;
  console.error('\n❌ Syntax check failed!\n');
  
  if (error.stderr) {
    console.error(error.stderr.toString());
  } else if (error.message) {
    console.error(error.message);
  }
  
  console.error('\n💡 Tip: Fix TypeScript errors and try again.');
  process.exit(exitCode);
}
