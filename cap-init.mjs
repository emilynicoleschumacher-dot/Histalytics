#!/usr/bin/env node
// Initialize Capacitor platforms programmatically
import { execSync } from 'child_process';
try {
  console.log('Adding Android platform...');
  execSync('npx cap add android', { cwd: '/home/team/shared/site', stdio: 'pipe', encoding: 'utf-8' });
  console.log('Android platform added.');
} catch(e) {
  console.log('Android add result:', e.message?.split('\n').slice(0,3).join('\n'));
}
try {
  console.log('Adding iOS platform...');
  execSync('npx cap add ios', { cwd: '/home/team/shared/site', stdio: 'pipe', encoding: 'utf-8' });
  console.log('iOS platform added.');
} catch(e) {
  console.log('iOS add result:', e.message?.split('\n').slice(0,3).join('\n'));
}
console.log('Capacitor setup complete.');
