#!/usr/bin/env node
/**
 * Update dependencies to latest, excluding pinned packages
 *
 * Packages without a caret (^) are considered pinned and will be skipped.
 *
 * Usage: node scripts/update-deps.mjs
 */

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJsonPath = join(__dirname, '..', 'package.json');

// Read package.json
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

// Packages to exclude from updates (pinned packages without caret)
const excludePackages = [];

// Check devDependencies for pinned packages (no caret)
if (packageJson.devDependencies) {
  for (const [pkg, version] of Object.entries(packageJson.devDependencies)) {
    // If version doesn't start with ^, ~, or * (i.e., it's pinned), exclude it
    if (!version.startsWith('^') && !version.startsWith('~') && !version.startsWith('*')) {
      excludePackages.push(pkg);
    }
  }
}

// Check dependencies for pinned packages
if (packageJson.dependencies) {
  for (const [pkg, version] of Object.entries(packageJson.dependencies)) {
    if (!version.startsWith('^') && !version.startsWith('~') && !version.startsWith('*')) {
      excludePackages.push(pkg);
    }
  }
}

if (excludePackages.length > 0) {
  console.log('📌 Pinned packages (will be skipped):');
  excludePackages.forEach((pkg) => {
    console.log(`   - ${pkg} (${packageJson.devDependencies?.[pkg] || packageJson.dependencies?.[pkg]})`);
  });
  console.log('');
}

// Get all packages to update (all packages minus excluded ones)
const allPackages = [
  ...Object.keys(packageJson.devDependencies || {}),
  ...Object.keys(packageJson.dependencies || {}),
];

const packagesToUpdate = allPackages.filter((pkg) => !excludePackages.includes(pkg));

if (packagesToUpdate.length === 0) {
  console.log('✅ No packages to update (all are pinned)');
  process.exit(0);
}

console.log(`🔄 Updating ${packagesToUpdate.length} package(s) to latest...\n`);

// Update each package individually
let updated = 0;
let failed = 0;

for (const pkg of packagesToUpdate) {
  try {
    console.log(`   Updating ${pkg}...`);
    execSync(`pnpm update --latest ${pkg}`, { stdio: 'inherit' });
    updated++;
  } catch (_error) {
    console.error(`   ❌ Failed to update ${pkg}`);
    failed++;
  }
}

console.log(`\n✅ Updated ${updated} package(s)`);
if (failed > 0) {
  console.log(`⚠️  Failed to update ${failed} package(s)`);
}
if (excludePackages.length > 0) {
  console.log(`📌 Skipped ${excludePackages.length} pinned package(s)`);
}
