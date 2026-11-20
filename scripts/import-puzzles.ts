/**
 * Downloads a random slice of the Sudoku Exchange puzzle bank (public domain,
 * generated with QQWing, graded with Sukaku Explainer) and writes
 * src/puzzles/data/puzzle-bank.json, split into the app's difficulty tiers.
 *
 *   npm run puzzles:import                 (500 puzzles per tier)
 *   npm run puzzles:import -- --per-tier=1000
 *
 * Every bank record is a fixed 100-byte line "<sha12> <81 digits> <rating>",
 * so an HTTP Range request at a 100-aligned offset returns whole records and
 * we never download the full files (they are 10-35 MB each). The bank is
 * sorted by hash, so any contiguous slice is already a random sample.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { randomInt } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { countSolutions } from '../src/core/solver.ts'
import { DIFFICULTY_TIERS } from '../src/puzzles/difficulty-tiers.ts'
import type {
  BankSource,
  Difficulty,
  PuzzleBankFile,
  PuzzleRecord,
} from '../src/interfaces/puzzle.ts'

const BANK_URL = 'https://raw.githubusercontent.com/grantm/sudoku-exchange-puzzle-bank/master'
const RECORD_BYTES = 100
const RECORD_PATTERN = /^([0-9a-f]{12}) ([0-9]{81})\s+(\d+\.\d)$/
/** Over-fetch so tiers that share a file (expert/extreme) both fill up. */
const FETCH_FACTOR = 5
const OUTPUT = new URL('../src/puzzles/data/puzzle-bank.json', import.meta.url)

const perTier = readPerTierArg()
const slices = new Map<BankSource, Promise<PuzzleRecord[]>>()
const tiers = {} as Record<Difficulty, string[]>

for (const tier of DIFFICULTY_TIERS) {
  if (!slices.has(tier.source)) slices.set(tier.source, fetchSlice(tier.source, perTier * FETCH_FACTOR))
  const records = await slices.get(tier.source)!
  const picked = records
    .filter(({ rating }) => rating >= tier.minRating && rating < tier.maxRating)
    .slice(0, perTier)
  if (picked.length < perTier) {
    throw new Error(`Only ${picked.length}/${perTier} puzzles for "${tier.difficulty}"; raise FETCH_FACTOR.`)
  }
  tiers[tier.difficulty] = picked.map(({ id, grid, rating }) => `${id} ${grid} ${rating.toFixed(1)}`)
  console.log(`${tier.difficulty.padEnd(8)} ${picked.length} puzzles from ${tier.source}.txt`)
}

const bank: PuzzleBankFile = {
  source: 'https://github.com/grantm/sudoku-exchange-puzzle-bank (public domain)',
  importedAt: new Date().toISOString().slice(0, 10),
  tiers,
}
await mkdir(new URL('.', OUTPUT), { recursive: true })
await writeFile(OUTPUT, `${JSON.stringify(bank, null, 2)}\n`)
console.log(`Wrote ${fileURLToPath(OUTPUT)}`)

async function fetchSlice(source: BankSource, count: number): Promise<PuzzleRecord[]> {
  const url = `${BANK_URL}/${source}.txt`
  const totalRecords = Math.floor((await fetchTotalBytes(url)) / RECORD_BYTES)
  const start = randomInt(0, Math.max(1, totalRecords - count)) * RECORD_BYTES
  const text = await fetchRange(url, start, start + count * RECORD_BYTES - 1)
  return text.split('\n').flatMap((raw) => {
    const record = parseLine(raw)
    return record ? [record] : []
  })
}

/** Validates the record format and that the puzzle has exactly one solution. */
function parseLine(raw: string): PuzzleRecord | null {
  const match = RECORD_PATTERN.exec(raw.trim())
  if (!match) return null
  const [, id, grid, rating] = match
  if (countSolutions(grid) !== 1) return null
  return { id, grid, rating: Number(rating) }
}

async function fetchTotalBytes(url: string): Promise<number> {
  const response = await rangeRequest(url, 0, RECORD_BYTES - 1)
  const total = Number(response.headers.get('content-range')?.split('/')[1])
  if (!Number.isFinite(total)) throw new Error(`No Content-Range from ${url}`)
  return total
}

async function fetchRange(url: string, from: number, to: number): Promise<string> {
  return (await rangeRequest(url, from, to)).text()
}

async function rangeRequest(url: string, from: number, to: number): Promise<Response> {
  // identity encoding: byte ranges must refer to the raw file, not a gzip stream.
  const response = await fetch(url, {
    headers: { Range: `bytes=${from}-${to}`, 'Accept-Encoding': 'identity' },
  })
  if (response.status !== 206) throw new Error(`Expected 206 from ${url}, got ${response.status}`)
  return response
}

function readPerTierArg(): number {
  const arg = process.argv.find((value) => value.startsWith('--per-tier='))
  const value = arg ? Number(arg.split('=')[1]) : 500
  if (!Number.isInteger(value) || value < 1) throw new Error('--per-tier must be a positive integer')
  return value
}
