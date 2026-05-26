/**
 * Genera archivos flashcards.md para cada subtema LPIC-1
 * extrayendo preguntas de ejercicios.md y conceptos clave de teoria.md
 */

import { readdirSync, statSync, readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname, basename } from 'path'

const CONTENT = join(process.cwd(), 'content')
const LPIC1 = join(CONTENT, 'lpic-1')

// ── Find all subtopic directories ──
function findSubtopicDirs(dir) {
  const results = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (!statSync(full).isDirectory()) continue
    // Subtopic dirs match pattern like "101.1-..."
    if (/^\d+\.\d+/.test(entry)) {
      results.push(full)
    } else {
      results.push(...findSubtopicDirs(full))
    }
  }
  return results
}

// ── Extract Q&A from ejercicios.md ──
function extractFromExercises(filepath) {
  if (!existsSync(filepath)) return []
  const content = readFileSync(filepath, 'utf-8').replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const cards = []

  // Match pattern: ### Pregunta N\n question \n options \n <details>..answer..</details>
  const questionRegex = /### Pregunta \d+\n([\s\S]*?)<details>\s*\n\s*<summary>Respuesta<\/summary>\s*\n([\s\S]*?)<\/details>/g
  let match
  while ((match = questionRegex.exec(content)) !== null) {
    const questionBlock = match[1].trim()
    const answerBlock = match[2].trim()

    // Extract just the question text (first line before options)
    const lines = questionBlock.split('\n').filter(l => l.trim())
    let question = ''
    const optionLines = []
    for (const line of lines) {
      if (/^[a-d]\)/.test(line.trim())) {
        optionLines.push(line.trim())
      } else if (question === '') {
        question = line.trim()
      } else if (!question.endsWith('?')) {
        question += ' ' + line.trim()
      }
    }

    // Extract the correct answer and explanation
    const boldMatch = answerBlock.match(/\*\*(.+?)\*\*/)
    const correctAnswer = boldMatch ? boldMatch[1] : ''
    const explanation = answerBlock.replace(/\*\*(.+?)\*\*\s*\n?/, '').trim()

    if (question && correctAnswer) {
      let answer = correctAnswer
      if (explanation) answer += '. ' + explanation
      cards.push({ question, answer })
    }
  }

  return cards
}

// ── Extract key concepts from teoria.md ──
function extractFromTheory(filepath) {
  if (!existsSync(filepath)) return []
  const content = readFileSync(filepath, 'utf-8').replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const cards = []

  // Extract "Para el examen" blockquotes
  const examTipRegex = />\s*\*\*Para el examen:?\*\*:?\s*([\s\S]*?)(?=\n\n|\n>|\n#)/g
  let match
  while ((match = examTipRegex.exec(content)) !== null) {
    const tip = match[1].replace(/^>\s*/gm, '').trim()
    if (tip.length > 20) {
      cards.push({
        question: 'Tip de examen: ' + tip.substring(0, 80) + (tip.length > 80 ? '...' : ''),
        answer: tip
      })
    }
  }

  // Extract command definitions from tables
  // Pattern: | `command` | Description |
  const tableRowRegex = /\|\s*`([^`]+)`\s*\|\s*([^|]+)\|/g
  const commandCards = []
  while ((match = tableRowRegex.exec(content)) !== null) {
    const cmd = match[1].trim()
    const desc = match[2].trim()
    if (cmd && desc && desc !== 'Descripcion' && desc !== 'Comando' && !desc.startsWith('---')) {
      commandCards.push({ question: `Que hace el comando \`${cmd}\`?`, answer: desc })
    }
  }
  // Only take up to 5 command cards per file to avoid flooding
  cards.push(...commandCards.slice(0, 5))

  // Extract definitions after ## headers
  const sectionRegex = /^## (.+)\n\n([^#\n].{30,200})/gm
  while ((match = sectionRegex.exec(content)) !== null) {
    const heading = match[1].trim()
    const text = match[2].trim()
    if (!heading.startsWith('Contenido') && !heading.startsWith('Navegacion') &&
        !heading.startsWith('Archivos') && !heading.startsWith('Referencia')) {
      cards.push({
        question: `Que es/son ${heading}?`,
        answer: text.split('\n')[0]
      })
    }
  }

  return cards
}

// ── Generate flashcard markdown ──
function generateFlashcardMd(subtemaNum, title, cards) {
  let md = `---
title: "${subtemaNum} - Flashcards"
tags:
  - lpic-1
  - flashcards
  - repaso
tipo: flashcards
subtema: "${subtemaNum}"
---

# Flashcards: ${subtemaNum} - ${title}

> ${cards.length} tarjetas de repaso. Usa el sistema de repeticion espaciada para memorizar.

`

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i]
    // Clean up markdown formatting for card content
    const q = card.question.replace(/\n/g, ' ').trim()
    const a = card.answer.replace(/\n/g, ' ').trim()

    md += `<div class="flashcard-deck" data-subtema="${subtemaNum}">
</div>

<div class="flashcard" data-id="${subtemaNum}-fc-${String(i + 1).padStart(3, '0')}">
<div class="flashcard-front">

**P:** ${q}

</div>
<div class="flashcard-back">

**R:** ${a}

</div>
</div>

---

`
  }

  return md
}

// ── Main ──
console.log('=== Generando flashcards para LPIC-1 ===\n')

const subtopicDirs = findSubtopicDirs(LPIC1)
let totalCards = 0

for (const dir of subtopicDirs) {
  const dirName = basename(dir)
  const subtemaMatch = dirName.match(/^(\d+\.\d+)-(.+)/)
  if (!subtemaMatch) continue

  const subtemaNum = subtemaMatch[1]
  const subtemaSlug = subtemaMatch[2]
  const title = subtemaSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  const ejerciciosPath = join(dir, 'ejercicios.md')
  const teoriaPath = join(dir, 'teoria.md')

  const exerciseCards = extractFromExercises(ejerciciosPath)
  const theoryCards = extractFromTheory(teoriaPath)

  // Deduplicate by checking similar questions
  const allCards = [...exerciseCards]
  for (const tc of theoryCards) {
    const isDup = allCards.some(ec =>
      ec.question.toLowerCase().includes(tc.question.toLowerCase().substring(0, 30)) ||
      tc.question.toLowerCase().includes(ec.question.toLowerCase().substring(0, 30))
    )
    if (!isDup) allCards.push(tc)
  }

  if (allCards.length === 0) {
    console.log(`  SKIP: ${subtemaNum} - sin contenido para flashcards`)
    continue
  }

  const flashcardMd = generateFlashcardMd(subtemaNum, title, allCards)
  const outputPath = join(dir, 'flashcards.md')
  writeFileSync(outputPath, flashcardMd, 'utf-8')

  console.log(`  ${subtemaNum}: ${allCards.length} tarjetas (${exerciseCards.length} ejercicios + ${allCards.length - exerciseCards.length} teoria)`)
  totalCards += allCards.length
}

console.log(`\n=== Total: ${totalCards} flashcards generadas ===`)
