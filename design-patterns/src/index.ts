/**
 * Design Patterns in TypeScript
 *
 * This file demonstrates all 10 essential design patterns with practical examples.
 * Run this file to see all patterns in action.
 */

import { demoFactory } from './factory';
import { demoBuilder } from './builder';
import { demoObserver } from './observer';
import { demoStrategy } from './strategy';
import { demoSingleton } from './singleton';
import { demoDecorator } from './decorator';
import { demoAdapter } from './adapter';
import { demoCommand } from './command';
import { demoTemplateMethod } from './template-method';
import { demoPrototype } from './prototype';

function printHeader(title: string): void {
  const line = '='.repeat(60);
  console.log(`\n${line}`);
  console.log(`  ${title}`);
  console.log(`${line}\n`);
}

function printSeparator(): void {
  console.log('\n' + '-'.repeat(60) + '\n');
}

function main(): void {
  console.clear();

  printHeader('DESIGN PATTERNS IN TYPESCRIPT');
  console.log('This repository showcases 10 essential design patterns');
  console.log('with practical, real-world examples.\n');

  const patterns = [
    { name: 'Factory Pattern', demo: demoFactory, category: 'Creational' },
    { name: 'Builder Pattern', demo: demoBuilder, category: 'Creational' },
    { name: 'Singleton Pattern', demo: demoSingleton, category: 'Creational' },
    { name: 'Prototype Pattern', demo: demoPrototype, category: 'Creational' },
    { name: 'Adapter Pattern', demo: demoAdapter, category: 'Structural' },
    { name: 'Decorator Pattern', demo: demoDecorator, category: 'Structural' },
    { name: 'Observer Pattern', demo: demoObserver, category: 'Behavioral' },
    { name: 'Strategy Pattern', demo: demoStrategy, category: 'Behavioral' },
    { name: 'Command Pattern', demo: demoCommand, category: 'Behavioral' },
    { name: 'Template Method Pattern', demo: demoTemplateMethod, category: 'Behavioral' }
  ];

  // Check command line arguments for specific pattern
  const args = process.argv.slice(2);

  if (args.length > 0) {
    const patternName = args[0].toLowerCase();
    const pattern = patterns.find(p =>
      p.name.toLowerCase().includes(patternName) ||
      p.name.toLowerCase().replace(' pattern', '').replace(' ', '-') === patternName
    );

    if (pattern) {
      printHeader(`${pattern.name} (${pattern.category})`);
      pattern.demo();
    } else {
      console.log(`Pattern "${patternName}" not found.\n`);
      console.log('Available patterns:');
      patterns.forEach((p, i) => {
        console.log(`  ${i + 1}. ${p.name} (${p.category})`);
      });
      console.log('\nUsage: npm run dev <pattern-name>');
      console.log('Example: npm run dev factory\n');
    }
  } else {
    // Run all patterns
    patterns.forEach((pattern, index) => {
      if (index > 0) printSeparator();
      printHeader(`${index + 1}. ${pattern.name} (${pattern.category})`);
      pattern.demo();
    });

    printSeparator();
    console.log('✅ All design patterns demonstrated successfully!\n');
    console.log('To run a specific pattern:');
    console.log('  npm run dev <pattern-name>\n');
    console.log('Examples:');
    console.log('  npm run dev factory');
    console.log('  npm run dev builder');
    console.log('  npm run dev observer\n');
  }
}

// Run the demo
main();
