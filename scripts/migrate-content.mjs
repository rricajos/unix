/**
 * Script de migracion: mueve contenido existente a content/,
 * aplana subcarpetas notas/ y ejercicios/, renombra README.md a index.md,
 * e inyecta frontmatter YAML.
 */

import { readdirSync, statSync, readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, rmSync } from 'fs'
import { join, basename, dirname, relative, sep } from 'path'

const ROOT = process.cwd()
const CONTENT = join(ROOT, 'content')
const DIRS_TO_MIGRATE = ['lpic-1', 'lpic-2', 'lpic-3', 'hacking-vault', 'recursos']

// ── Helpers ──

function walkDir(dir) {
  const results = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      results.push(...walkDir(full))
    } else {
      results.push(full)
    }
  }
  return results
}

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true })
}

/** Extract subtema number from directory name like "101.1-configuracion-de-hardware" */
function extractSubtema(dirName) {
  const match = dirName.match(/^(\d+\.\d+)/)
  return match ? match[1] : null
}

/** Extract tema number from directory name like "tema-101-arquitectura-del-sistema" */
function extractTema(dirName) {
  const match = dirName.match(/tema-(\d+)/)
  return match ? match[1] : null
}

/** Extract exam number from path */
function extractExamen(path) {
  const match = path.match(/(\d{3})-exam/)
  return match ? match[1] : null
}

/** Extract certification from path */
function extractCertificacion(path) {
  if (path.includes('lpic-1')) return 'lpic-1'
  if (path.includes('lpic-2')) return 'lpic-2'
  if (path.includes('lpic-3')) return 'lpic-3'
  return null
}

/** Determine content type from filename */
function determineTipo(filename, relPath) {
  if (filename === 'index.md') {
    // Check if it's a subtema index, tema index, exam index, etc.
    if (relPath.match(/\d+\.\d+[^/]*\/index\.md$/)) return 'indice-subtema'
    if (relPath.match(/tema-\d+[^/]*\/index\.md$/)) return 'indice-tema'
    if (relPath.match(/\d{3}-exam\/index\.md$/)) return 'indice-examen'
    if (relPath.match(/lpic-\d\/index\.md$/)) return 'indice-certificacion'
    if (relPath.includes('hacking-vault')) return 'indice-hacking'
    if (relPath.includes('recursos')) return 'indice-recursos'
    return 'indice'
  }
  if (filename === 'teoria.md') return 'teoria'
  if (filename === 'comandos-clave.md') return 'comandos'
  if (filename === 'ejercicios.md') return 'ejercicios'
  if (filename === 'flashcards.md') return 'flashcards'
  return 'contenido'
}

/** Generate tags based on path and type */
function generateTags(relPath, tipo, cert, examen, tema, subtema) {
  const tags = []

  if (cert) tags.push(cert)
  if (examen) tags.push(`examen-${examen}`)
  if (tema) tags.push(`tema-${tema}`)
  if (tipo && tipo !== 'indice') tags.push(tipo)

  // Hacking vault tags
  if (relPath.includes('hacking-vault')) {
    tags.push('hacking')
    if (relPath.includes('ofensivo')) tags.push('ofensivo')
    if (relPath.includes('defensivo')) tags.push('defensivo')
    if (relPath.includes('laboratorios')) tags.push('laboratorios')
    // Specific sections
    if (relPath.includes('reconocimiento')) tags.push('reconocimiento')
    if (relPath.includes('enumeracion')) tags.push('enumeracion')
    if (relPath.includes('explotacion')) tags.push('explotacion')
    if (relPath.includes('post-explotacion')) tags.push('post-explotacion')
    if (relPath.includes('hardening')) tags.push('hardening')
    if (relPath.includes('blue-team')) tags.push('blue-team')
    if (relPath.includes('firewalls')) tags.push('firewalls')
    if (relPath.includes('criptografia')) tags.push('criptografia')
  }

  // Recursos tags
  if (relPath.includes('recursos')) {
    tags.push('recursos')
    if (relPath.includes('glosario')) tags.push('glosario')
    if (relPath.includes('comandos-rapidos')) tags.push('referencia')
    if (relPath.includes('enlaces')) tags.push('enlaces')
    if (relPath.includes('libros')) tags.push('libros')
  }

  return tags
}

/** Generate a title from the content or filename */
function generateTitle(content, filename, relPath) {
  // Try to get title from first H1
  const h1Match = content.match(/^#\s+(.+)$/m)
  if (h1Match) return h1Match[1].trim()

  // Fallback: format the filename
  const name = filename.replace('.md', '').replace(/-/g, ' ')
  return name.charAt(0).toUpperCase() + name.slice(1)
}

/** Build frontmatter YAML string */
function buildFrontmatter(title, tags, tipo, cert, examen, tema, subtema) {
  let fm = '---\n'
  fm += `title: "${title.replace(/"/g, '\\"')}"\n`
  if (tags.length > 0) {
    fm += `tags:\n`
    for (const tag of tags) {
      fm += `  - ${tag}\n`
    }
  }
  if (tipo) fm += `tipo: ${tipo}\n`
  if (cert) fm += `certificacion: ${cert}\n`
  if (examen) fm += `examen: "${examen}"\n`
  if (tema) fm += `tema: "${tema}"\n`
  if (subtema) fm += `subtema: "${subtema}"\n`
  fm += '---\n\n'
  return fm
}

/** Check if file already has frontmatter */
function hasFrontmatter(content) {
  return content.trimStart().startsWith('---')
}

// ── Main Migration ──

console.log('=== Migracion de contenido a content/ ===\n')

// Step 1: Copy directories to content/
for (const dir of DIRS_TO_MIGRATE) {
  const srcDir = join(ROOT, dir)
  if (!existsSync(srcDir)) {
    console.log(`  SKIP: ${dir}/ no existe`)
    continue
  }

  console.log(`Procesando ${dir}/...`)
  const files = walkDir(srcDir)
  let mdCount = 0

  for (const srcFile of files) {
    const relFromSrc = relative(srcDir, srcFile)
    let destRel = relFromSrc

    // Skip .gitkeep files
    if (basename(srcFile) === '.gitkeep') continue

    // Skip .sh files (scripts)
    if (srcFile.endsWith('.sh')) continue

    // Only process .md files
    if (!srcFile.endsWith('.md')) continue

    // Flatten: notas/teoria.md → teoria.md
    destRel = destRel.replace(/notas[/\\]teoria\.md$/, 'teoria.md')
    destRel = destRel.replace(/notas[/\\]comandos-clave\.md$/, 'comandos-clave.md')
    destRel = destRel.replace(/ejercicios[/\\]ejercicios\.md$/, 'ejercicios.md')

    // Rename README.md → index.md
    destRel = destRel.replace(/README\.md$/, 'index.md')

    const destFile = join(CONTENT, dir, destRel)
    ensureDir(dirname(destFile))

    // Read content
    let content = readFileSync(srcFile, 'utf-8')

    // Skip if already has frontmatter
    if (hasFrontmatter(content)) {
      copyFileSync(srcFile, destFile)
      mdCount++
      continue
    }

    // Compute metadata
    const destRelFromContent = relative(CONTENT, destFile).replace(/\\/g, '/')
    const cert = extractCertificacion(destRelFromContent)
    const examen = extractExamen(destRelFromContent)

    // Extract tema from directory path
    let tema = null
    const pathParts = destRelFromContent.split('/')
    for (const part of pathParts) {
      const t = extractTema(part)
      if (t) { tema = t; break }
    }

    // Extract subtema from directory path
    let subtema = null
    for (const part of pathParts) {
      const s = extractSubtema(part)
      if (s) { subtema = s; break }
    }

    const filename = basename(destFile)
    const tipo = determineTipo(filename, destRelFromContent)
    const title = generateTitle(content, filename, destRelFromContent)
    const tags = generateTags(destRelFromContent, tipo, cert, examen, tema, subtema)

    // Build frontmatter and prepend
    const frontmatter = buildFrontmatter(title, tags, tipo, cert, examen, tema, subtema)
    content = frontmatter + content

    writeFileSync(destFile, content, 'utf-8')
    mdCount++
  }

  console.log(`  → ${mdCount} archivos markdown migrados`)
}

// Step 2: Copy recursos files that need special handling
console.log('\n=== Actualizando content/index.md ===')
console.log('  → Landing page ya existe')

// Step 3: Count totals
const allContent = walkDir(CONTENT).filter(f => f.endsWith('.md'))
console.log(`\n=== Migracion completada ===`)
console.log(`Total archivos markdown en content/: ${allContent.length}`)
