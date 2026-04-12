import { encode, decode } from 'gpt-tokenizer'

// ── Token color palette (cycling) ───────────────────────────────────────────
const TOK_BG = [
  'rgba(255, 107, 107, 0.20)',  // coral
  'rgba(78,  205, 196, 0.20)',  // teal
  'rgba(255, 210,  63, 0.20)',  // gold
  'rgba(167, 130, 255, 0.20)',  // lavender
  'rgba(80,  200, 120, 0.20)',  // mint
  'rgba(255, 153, 102, 0.20)',  // peach
  'rgba(100, 180, 255, 0.20)',  // sky blue
  'rgba(255, 200, 150, 0.20)',  // apricot
]

const TOK_BORDER = [
  'rgba(255, 107, 107, 0.55)',
  'rgba(78,  205, 196, 0.55)',
  'rgba(255, 210,  63, 0.55)',
  'rgba(167, 130, 255, 0.55)',
  'rgba(80,  200, 120, 0.55)',
  'rgba(255, 153, 102, 0.55)',
  'rgba(100, 180, 255, 0.55)',
  'rgba(255, 200, 150, 0.55)',
]

// ── Analysis ─────────────────────────────────────────────────────────────────
function analyzeText(text) {
  if (!text) {
    return { tokenCount: 0, chars: 0, words: 0, lines: 0, uniqueTokens: 0, segments: [] }
  }

  const encoded = encode(text)
  const tokenCount = encoded.length
  const chars = text.length
  const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0
  // Count non-empty lines only
  const lines = text.split('\n').filter(l => l.trim().length > 0).length
  const uniqueTokens = new Set(encoded).size

  // Decode each token individually for visualization
  const segments = encoded.map(id => {
    try {
      return decode([id])
    } catch {
      return '\uFFFD' // replacement char on error
    }
  })

  return { tokenCount, chars, words, lines, uniqueTokens, segments }
}

// ── Rendering helpers ─────────────────────────────────────────────────────────
function fmt(n) {
  return n.toLocaleString('en-US')
}

function renderViz(segments, container) {
  if (!segments.length) {
    container.innerHTML = '<span class="viz-empty">Tokens will appear here as you type…</span>'
    container.classList.remove('has-tokens')
    return
  }

  container.classList.add('has-tokens')

  const html = segments.map((seg, i) => {
    const bg = TOK_BG[i % TOK_BG.length]
    const border = TOK_BORDER[i % TOK_BORDER.length]

    // Escape HTML entities
    const escaped = seg
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')

    // Preserve spaces and handle newlines visually
    const displayed = escaped
      .replace(/\n/g, '<span class="tok-nl" aria-label="newline">↵</span>\n')
      .replace(/ /g, '&nbsp;')
      .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')

    const title = `Token ${i + 1}${seg === '\n' ? ' (newline)' : seg.trim() === '' ? ' (whitespace)' : ': ' + seg.trim()}`

    return `<span class="tok" style="background:${bg};--tok-border:${border}" title="${title}" aria-label="${title}">${displayed || '&nbsp;'}</span>`
  }).join('')

  container.innerHTML = html
}

// ── Panel update ──────────────────────────────────────────────────────────────
function updatePanel(id) {
  const textarea = document.getElementById(`text-${id}`)
  const text = textarea.value
  const { tokenCount, chars, words, lines, uniqueTokens, segments } = analyzeText(text)

  // Primary stats
  document.getElementById(`tokens-${id}`).textContent = fmt(tokenCount)
  document.getElementById(`chars-${id}`).textContent   = fmt(chars)
  document.getElementById(`words-${id}`).textContent   = fmt(words)
  document.getElementById(`lines-${id}`).textContent   = fmt(lines)

  // Secondary stats
  const density    = words > 0    ? (tokenCount / words).toFixed(2) : '—'
  const efficiency = tokenCount > 0 ? ((uniqueTokens / tokenCount) * 100).toFixed(0) + '%' : '—'
  document.getElementById(`density-${id}`).textContent    = density
  document.getElementById(`unique-${id}`).textContent     = tokenCount > 0 ? fmt(uniqueTokens) : '—'
  document.getElementById(`efficiency-${id}`).textContent = efficiency

  // Visualization
  renderViz(segments, document.getElementById(`viz-${id}`))

  // Animate updated stat
  animateStat(`tokens-${id}`)

  // Update comparison
  updateComparison()
}

function animateStat(elemId) {
  const el = document.getElementById(elemId)
  el.classList.remove('stat-pop')
  // Force reflow
  void el.offsetWidth
  el.classList.add('stat-pop')
}

// ── Comparison bar ────────────────────────────────────────────────────────────
function updateComparison() {
  const tokA = parseStatNum('tokens-a')
  const tokB = parseStatNum('tokens-b')

  const max = Math.max(tokA, tokB, 1)
  const pctA = ((tokA / max) * 100).toFixed(1)
  const pctB = ((tokB / max) * 100).toFixed(1)

  document.getElementById('cmp-fill-a').style.width = `${pctA}%`
  document.getElementById('cmp-fill-b').style.width = `${pctB}%`
  document.getElementById('cmp-count-a').textContent = fmt(tokA)
  document.getElementById('cmp-count-b').textContent = fmt(tokB)

  const verdict = document.getElementById('cmp-verdict')
  if (tokA === 0 && tokB === 0) {
    verdict.textContent = 'Enter text in both panels to compare token counts'
    verdict.className = 'cmp-verdict cmp-neutral'
  } else if (tokA === 0 || tokB === 0) {
    verdict.textContent = 'Enter text in the other panel to start comparing'
    verdict.className = 'cmp-verdict cmp-neutral'
  } else if (tokA === tokB) {
    verdict.textContent = `Both texts use the same number of tokens (${fmt(tokA)})`
    verdict.className = 'cmp-verdict cmp-equal'
  } else {
    const winner    = tokA > tokB ? 'A' : 'B'
    const loser     = tokA > tokB ? 'B' : 'A'
    const diff      = Math.abs(tokA - tokB)
    const smaller   = Math.min(tokA, tokB)
    const pctMore   = ((diff / smaller) * 100).toFixed(1)
    verdict.textContent = `Panel ${winner} uses ${fmt(diff)} more token${diff !== 1 ? 's' : ''} than ${loser} (+${pctMore}%)`
    verdict.className   = `cmp-verdict cmp-${winner.toLowerCase()}-wins`
  }
}

function parseStatNum(id) {
  return parseInt(document.getElementById(id).textContent.replace(/,/g, ''), 10) || 0
}

// ── Init ─────────────────────────────────────────────────────────────────────
function init() {
  // Textarea listeners
  ;['a', 'b'].forEach(id => {
    document.getElementById(`text-${id}`).addEventListener('input', () => updatePanel(id))
  })

  // Clear buttons
  document.querySelectorAll('.btn-clear').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target        // e.g. "text-a"
      const id     = target.replace('text-', '') // e.g. "a"
      document.getElementById(target).value = ''
      updatePanel(id)
    })
  })

  // Initial render (handles empty state)
  updatePanel('a')
  updatePanel('b')
}

document.addEventListener('DOMContentLoaded', init)
