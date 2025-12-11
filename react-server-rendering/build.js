import * as esbuild from 'esbuild';

/**
 * Build script for client-side bundle
 *
 * This script uses esbuild to bundle the client-side React code.
 * The output is placed in the public/ directory where Express can serve it.
 */

console.log('🔨 Building client bundle...\n');

try {
  await esbuild.build({
    entryPoints: ['src/client.jsx'],
    bundle: true,
    outfile: 'public/client.js',
    format: 'esm',
    platform: 'browser',
    target: ['es2020'],
    jsx: 'automatic',
    minify: process.env.NODE_ENV === 'production',
    sourcemap: process.env.NODE_ENV !== 'production',
    logLevel: 'info',
  });

  console.log('\n✅ Build complete! Client bundle ready at public/client.js\n');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}
