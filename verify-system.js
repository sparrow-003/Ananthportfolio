#!/usr/bin/env node

/**
 * Blog System Verification Script
 * This script checks if all components are properly configured
 */

import fs from 'fs';
import path from 'path';

console.log('🚀 Blog System Verification Starting...\n');

const checks = [
  {
    name: 'Environment Configuration',
    check: () => {
      const envExists = fs.existsSync('.env');
      const envExampleExists = fs.existsSync('.env.example');
      return envExists && envExampleExists;
    }
  },
  {
    name: 'Supabase Client Configuration',
    check: () => {
      const clientPath = 'src/integrations/supabase/client.ts';
      return fs.existsSync(clientPath);
    }
  },
  {
    name: 'Database Schema',
    check: () => {
      const schemaPath = 'database-setup.sql';
      return fs.existsSync(schemaPath);
    }
  },
  {
    name: 'Blog Components',
    check: () => {
      const components = [
        'src/components/admin/PostEditor.tsx',
        'src/components/BlogList.tsx',
        'src/components/BlogCard.tsx',
        'src/pages/Blog.tsx'
      ];
      return components.every(comp => fs.existsSync(comp));
    }
  },
  {
    name: 'Admin System',
    check: () => {
      const adminFiles = [
        'src/pages/AdminPanel.tsx',
        'src/components/AdminLogin.tsx',
        'src/components/AdminDashboard.tsx'
      ];
      return adminFiles.every(file => fs.existsSync(file));
    }
  },
  {
    name: 'Package Dependencies',
    check: () => {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const requiredDeps = [
        '@supabase/supabase-js',
        '@tanstack/react-query',
        'framer-motion',
        'lucide-react',
        'sonner',
        'react-router-dom'
      ];
      return requiredDeps.every(dep => 
        packageJson.dependencies[dep] || packageJson.devDependencies[dep]
      );
    }
  }
];

let allPassed = true;

checks.forEach((check, index) => {
  const passed = check.check();
  const status = passed ? '✅' : '❌';
  console.log(`${status} ${check.name}`);
  
  if (!passed) {
    allPassed = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allPassed) {
  console.log('🎉 All checks passed! Your blog system is ready to use.');
  console.log('\n📋 Next Steps:');
  console.log('1. Run: npm run dev');
  console.log('2. Visit: http://localhost:8080');
  console.log('3. Go to: /blog to see the blog');
  console.log('4. Go to: /genesis-node-control-x99-admin for admin panel');
  console.log('5. Test system: /blog-system-test');
} else {
  console.log('⚠️  Some checks failed. Please review the issues above.');
}

console.log('\n🔗 Important URLs:');
console.log('• Blog: /blog');
console.log('• Admin: /genesis-node-control-x99-admin');
console.log('• Test: /blog-system-test');