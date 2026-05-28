/**
 * Genera mazos Anki (.apkg) a partir de los archivos flashcards.md
 * Produce un .apkg por certificacion: lpic-1, lpic-2, lpic-3, hacking-vault
 *
 * Uses sql.js (WASM SQLite) + JSZip to build .apkg files directly.
 * The .apkg format is a ZIP containing:
 *   - collection.anki2  (SQLite DB with Anki schema)
 *   - media              (JSON mapping, empty for text-only decks)
 */

import { readdirSync, statSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, basename, dirname } from 'path'
import { createRequire } from 'module'
import initSqlJs from 'sql.js'
import JSZip from 'jszip'
import { createHash } from 'crypto'

const CONTENT = join(process.cwd(), 'content')
const OUTPUT = join(process.cwd(), 'quartz', 'static', 'anki')

const CERTS = [
  { name: 'lpic-1', dir: join(CONTENT, 'lpic-1'), label: 'LPIC-1' },
  { name: 'lpic-2', dir: join(CONTENT, 'lpic-2'), label: 'LPIC-2' },
  { name: 'lpic-3', dir: join(CONTENT, 'lpic-3'), label: 'LPIC-3' },
  { name: 'hacking-vault', dir: join(CONTENT, 'hacking-vault'), label: 'Hacking Vault' },
]

// ── Unique ID generators ──
let idCounter = 0
function uniqueId() {
  // Anki uses millisecond timestamps as IDs; we add a counter to avoid collisions
  return Date.now() + (++idCounter)
}

function guidFrom(text) {
  return createHash('md5').update(text).digest('hex').slice(0, 10)
}

function fieldChecksum(text) {
  // Anki uses first 8 hex digits of SHA1 of the sort field, as a 32-bit int
  const sha1 = createHash('sha1').update(text).digest('hex')
  return parseInt(sha1.slice(0, 8), 16)
}

// ── Find all flashcards.md files recursively ──
function findFlashcardFiles(dir) {
  const results = []
  if (!existsSync(dir)) return results
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      results.push(...findFlashcardFiles(full))
    } else if (entry === 'flashcards.md') {
      results.push(full)
    }
  }
  return results
}

// ── Extract cards from a flashcards.md file ──
function extractCards(filepath) {
  const content = readFileSync(filepath, 'utf-8').replace(/\r\n/g, '\n')
  const cards = []

  const cardRegex = /<div class="flashcard"[^>]*>[\s\S]*?<div class="flashcard-front">\s*\n([\s\S]*?)<\/div>\s*\n\s*<div class="flashcard-back">\s*\n([\s\S]*?)<\/div>\s*\n\s*<\/div>/g

  let match
  while ((match = cardRegex.exec(content)) !== null) {
    let front = match[1].trim()
    let back = match[2].trim()

    // Remove **P:** and **R:** prefixes
    front = front.replace(/^\*\*P:\*\*\s*/, '')
    back = back.replace(/^\*\*R:\*\*\s*/, '')

    // Convert markdown → HTML for Anki
    front = mdToHtml(front)
    back = mdToHtml(back)

    if (front && back) {
      cards.push({ front, back })
    }
  }

  return cards
}

// ── Simple markdown → HTML for Anki cards ──
function mdToHtml(text) {
  return text
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/\*([^*]+)\*/g, '<i>$1</i>')
    .replace(/\n/g, '<br>')
}

// ── Extract subtema label from directory path ──
function getSubtemaLabel(filepath) {
  const parentDir = basename(dirname(filepath))
  const subtemaMatch = parentDir.match(/^(\d+\.\d+)/)
  if (subtemaMatch) return subtemaMatch[1]
  return parentDir.replace(/-/g, ' ')
}

// ── Build an Anki .apkg from a list of {front, back, tags} ──
async function buildApkg(SQL, deckName, cards) {
  const db = new SQL.Database()

  const now = Math.floor(Date.now() / 1000)
  const deckId = uniqueId()
  const modelId = uniqueId()

  // Anki collection schema
  db.run(`
    CREATE TABLE col (
      id integer PRIMARY KEY,
      crt integer NOT NULL,
      mod integer NOT NULL,
      scm integer NOT NULL,
      ver integer NOT NULL,
      dty integer NOT NULL,
      usn integer NOT NULL,
      ls integer NOT NULL,
      conf text NOT NULL,
      models text NOT NULL,
      decks text NOT NULL,
      dconf text NOT NULL,
      tags text NOT NULL
    )
  `)
  db.run(`
    CREATE TABLE notes (
      id integer PRIMARY KEY,
      guid text NOT NULL,
      mid integer NOT NULL,
      mod integer NOT NULL,
      usn integer NOT NULL,
      tags text NOT NULL,
      flds text NOT NULL,
      sfld text NOT NULL,
      csum integer NOT NULL,
      flags integer NOT NULL,
      data text NOT NULL
    )
  `)
  db.run(`
    CREATE TABLE cards (
      id integer PRIMARY KEY,
      nid integer NOT NULL,
      did integer NOT NULL,
      ord integer NOT NULL,
      mod integer NOT NULL,
      usn integer NOT NULL,
      type integer NOT NULL,
      queue integer NOT NULL,
      due integer NOT NULL,
      ivl integer NOT NULL,
      factor integer NOT NULL,
      reps integer NOT NULL,
      lapses integer NOT NULL,
      left integer NOT NULL,
      odue integer NOT NULL,
      odid integer NOT NULL,
      flags integer NOT NULL,
      data text NOT NULL
    )
  `)
  db.run(`CREATE TABLE revlog (
    id integer PRIMARY KEY,
    cid integer NOT NULL,
    usn integer NOT NULL,
    ease integer NOT NULL,
    ivl integer NOT NULL,
    lastIvl integer NOT NULL,
    factor integer NOT NULL,
    time integer NOT NULL,
    type integer NOT NULL
  )`)
  db.run(`CREATE TABLE graves (usn integer NOT NULL, oid integer NOT NULL, type integer NOT NULL)`)

  // Model (note type): Basic with Front and Back fields
  const model = {
    [modelId]: {
      id: modelId,
      name: 'Basic',
      type: 0,
      mod: now,
      usn: -1,
      sortf: 0,
      did: deckId,
      tmpls: [{
        name: 'Card 1',
        ord: 0,
        qfmt: '{{Front}}',
        afmt: '{{FrontSide}}<hr id=answer>{{Back}}',
        bqfmt: '',
        bafmt: '',
        did: null,
        bfont: '',
        bsize: 0,
      }],
      flds: [
        { name: 'Front', ord: 0, sticky: false, rtl: false, font: 'Arial', size: 20, media: [] },
        { name: 'Back', ord: 1, sticky: false, rtl: false, font: 'Arial', size: 20, media: [] },
      ],
      css: '.card { font-family: arial; font-size: 20px; text-align: center; color: black; background-color: white; } code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; font-family: monospace; }',
      latexPre: '',
      latexPost: '',
      latexsvg: false,
      req: [[0, 'all', [0]]],
      vers: [],
      tags: [],
    }
  }

  // Deck
  const decks = {
    1: { id: 1, name: 'Default', conf: 1, desc: '', dyn: 0, extendNew: 0, extendRev: 0, mod: now, usn: -1 },
    [deckId]: {
      id: deckId,
      name: deckName,
      conf: 1,
      desc: '',
      dyn: 0,
      extendNew: 10,
      extendRev: 50,
      mod: now,
      usn: -1,
    }
  }

  // Default deck config
  const dconf = {
    1: {
      id: 1, name: 'Default', maxTaken: 60, autoplay: true, timer: 0, replayq: true,
      new: { delays: [1, 10], ints: [1, 4, 0], initialFactor: 2500, order: 1, perDay: 20 },
      rev: { perDay: 200, ease4: 1.3, fuzz: 0.05, minSpace: 1, ivlFct: 0, maxIvl: 36500 },
      lapse: { delays: [10], mult: 0, minInt: 1, leechFails: 8, leechAction: 0 },
      dyn: false,
    }
  }

  // Collection config
  const conf = {
    nextPos: cards.length,
    estTimes: true,
    activeDecks: [1],
    sortType: 'noteFld',
    timeLim: 0,
    sortBackwards: false,
    addToCur: true,
    curDeck: deckId,
    newSpread: 0,
    dueCounts: true,
    curModel: modelId,
    collapseTime: 1200,
  }

  db.run(
    `INSERT INTO col VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [1, now, now, now * 1000, 11, 0, 0, 0,
      JSON.stringify(conf), JSON.stringify(model), JSON.stringify(decks), JSON.stringify(dconf), '{}']
  )

  // Insert notes and cards
  const noteStmt = db.prepare(
    `INSERT INTO notes VALUES(?,?,?,?,?,?,?,?,?,?,?)`
  )
  const cardStmt = db.prepare(
    `INSERT INTO cards VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
  )

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i]
    const noteId = uniqueId()
    const cardId = uniqueId()
    const guid = guidFrom(card.front + card.back + i)
    const flds = card.front + '\x1f' + card.back  // Anki uses 0x1f as field separator
    const tags = card.tags ? ' ' + card.tags.join(' ') + ' ' : ''
    const csum = fieldChecksum(card.front)

    noteStmt.run([noteId, guid, modelId, now, -1, tags, flds, card.front, csum, 0, ''])
    cardStmt.run([cardId, noteId, deckId, 0, now, -1, 0, 0, i, 0, 0, 0, 0, 0, 0, 0, 0, ''])
  }

  noteStmt.free()
  cardStmt.free()

  // Export database to binary
  const dbBinary = db.export()
  db.close()

  // Create ZIP (.apkg)
  const zip = new JSZip()
  zip.file('collection.anki2', dbBinary)
  zip.file('media', '{}')

  return zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })
}

// ── Main ──
async function main() {
  if (!existsSync(OUTPUT)) {
    mkdirSync(OUTPUT, { recursive: true })
  }

  const SQL = await initSqlJs()
  let grandTotal = 0

  for (const cert of CERTS) {
    if (!existsSync(cert.dir)) {
      console.log(`Skip: ${cert.label} - directorio no encontrado`)
      continue
    }

    console.log(`\n=== Generando mazo Anki: ${cert.label} ===\n`)

    const files = findFlashcardFiles(cert.dir)
    const allCards = []

    for (const file of files) {
      const cards = extractCards(file)
      const subtema = getSubtemaLabel(file)

      for (const card of cards) {
        allCards.push({
          front: card.front,
          back: card.back,
          tags: [cert.name, subtema.replace(/\s+/g, '-')]
        })
      }

      if (cards.length > 0) {
        console.log(`  ${subtema}: ${cards.length} tarjetas`)
      }
    }

    if (allCards.length === 0) {
      console.log(`  Sin tarjetas para ${cert.label}`)
      continue
    }

    const deckName = cert.label + ' - Flashcards'
    const apkgBuffer = await buildApkg(SQL, deckName, allCards)
    const outputPath = join(OUTPUT, cert.name + '.apkg')
    writeFileSync(outputPath, apkgBuffer)

    const sizeMB = (apkgBuffer.length / 1024).toFixed(1)
    console.log(`\n  ${cert.label}: ${allCards.length} tarjetas -> ${cert.name}.apkg (${sizeMB} KB)`)
    grandTotal += allCards.length
  }

  console.log(`\n=== TOTAL: ${grandTotal} tarjetas en mazos Anki ===`)
}

main().catch(err => {
  console.error('Error generando mazos Anki:', err)
  process.exit(1)
})
