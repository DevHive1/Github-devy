#!/usr/bin/env node

/**
 * ESLint Check Tool
 * Validates code quality and style across the project
 * 
 * Best Practices Applied:
 * - Uses project-local eslint for consistency
 * - Proper error handling with clear messages
 * - Cross-platform path resolution
 * - Exit codes for CI/CD integration
 */

import { execFileSync } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import process from 'process';

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('🔍 Running ESLint check...\n');

try {
  // Resolve eslint path
  const eslintPath = resolve(__dirname, '..', 'node_modules', '.bin', 'eslint');
  
  // Run ESLint on src and server directories
  execFileSync(
    'node',
    [
      eslintPath,
      'src',
      'server',
      '--ext', '.ts,.tsx,.js,.jsx',
      '--max-warnings', '0',
      '--no-error-on-unmatched-pattern'
    ],
    {
      cwd: resolve(__dirname, '..'),
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'development'
      }
    }
  );
  
  console.log('✅ ESLint check passed!\n');
  process.exit(0);
} catch (error) {
  const exitCode = error.status || 1;
  console.error('\n❌ ESLint check failed!\n');
  
  if (error.stderr) {
    console.error(error.stderr.toString());
  } else if (error.message) {
    console.error(error.message);
  }
  
  console.error('\n💡 Tip: Fix ESLint errors and try again.');
  process.exit(exitCode);
}
