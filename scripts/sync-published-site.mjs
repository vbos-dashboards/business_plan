/**
 * After `vite build`, copies dist output to:
 * - repo root (so GitHub Pages "main / (root)" serves the real bundle, not dev index.html)
 * - docs/ (optional mirror for "main / docs" publishing)
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const dist = path.join(root, 'dist')

function rmRf(p) {
  if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true })
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  for (const name of fs.readdirSync(src)) {
    const s = path.join(src, name)
    const d = path.join(dest, name)
    if (fs.statSync(s).isDirectory()) copyDir(s, d)
    else fs.copyFileSync(s, d)
  }
}

if (!fs.existsSync(dist)) {
  console.error('sync-published-site: dist/ missing — run vite build first')
  process.exit(1)
}

// Mirror dist → docs/
const docs = path.join(root, 'docs')
rmRf(docs)
copyDir(dist, docs)

// Copy dist top-level entries → repo root (do not delete src/, package.json, etc.)
for (const name of fs.readdirSync(dist)) {
  const src = path.join(dist, name)
  const dest = path.join(root, name)
  if (fs.statSync(src).isDirectory()) {
    rmRf(dest)
    copyDir(src, dest)
  } else {
    fs.copyFileSync(src, dest)
  }
}

console.log('sync-published-site: updated docs/ and repo root from dist/')
