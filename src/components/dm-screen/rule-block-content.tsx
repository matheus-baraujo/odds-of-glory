import type { ReactNode } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

type ContentBlock =
  | { type: 'table'; rows: string[][] }
  | { type: 'list'; items: string[] }
  | { type: 'paragraph'; text: string }

function isTableSeparator(line: string): boolean {
  const cells = line
    .split('|')
    .slice(1, -1)
    .map((c) => c.trim())
  return cells.length > 0 && cells.every((c) => /^:?-{2,}:?$/.test(c))
}

function parseTableRow(line: string): string[] {
  return line
    .split('|')
    .slice(1, -1)
    .map((c) => c.trim())
}

function parseBody(body: string): ContentBlock[] {
  const lines = body.split('\n')
  const blocks: ContentBlock[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.trim() === '') {
      i++
      continue
    }

    if (line.startsWith('|')) {
      const tableLines: string[] = []
      while (i < lines.length && lines[i].startsWith('|')) {
        tableLines.push(lines[i])
        i++
      }
      const rows = tableLines
        .filter((l) => !isTableSeparator(l))
        .map(parseTableRow)
        .filter((row) => row.some((cell) => cell.length > 0))
      if (rows.length > 0) blocks.push({ type: 'table', rows })
      continue
    }

    if (/^[-*] /.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^[-*] /.test(lines[i])) {
        items.push(lines[i].replace(/^[-*] /, ''))
        i++
      }
      blocks.push({ type: 'list', items })
      continue
    }

    blocks.push({ type: 'paragraph', text: line })
    i++
  }

  return blocks
}

function rollResultRowClass(firstCell: string): string | undefined {
  const cell = firstCell.toLowerCase()
  if (cell.includes('crítico') || cell.includes('6,6')) {
    return 'text-[var(--gold)]'
  }
  if (cell.includes('sucesso') && !cell.includes('parcial')) {
    return 'text-emerald-400'
  }
  if (cell.includes('parcial') || cell.includes('4–5') || cell.includes('4-5')) {
    return 'text-amber-400/90'
  }
  if (cell.includes('falha') || cell.includes('1–3') || cell.includes('1-3')) {
    return 'text-red-400/90'
  }
  return undefined
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const regex = /\*\*([^*]+)\*\*|\*([^*]+)\*/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  let partIndex = 0

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }
    if (match[1] !== undefined) {
      nodes.push(
        <strong key={`${keyPrefix}-b-${partIndex}`} className="font-semibold text-[var(--ink)]">
          {match[1]}
        </strong>
      )
    } else if (match[2] !== undefined) {
      nodes.push(
        <em key={`${keyPrefix}-i-${partIndex}`} className="text-[var(--steel-light)]">
          {match[2]}
        </em>
      )
    }
    lastIndex = match.index + match[0].length
    partIndex++
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes.length > 0 ? nodes : [text]
}

function MarkdownTable({ rows }: { rows: string[][] }) {
  const [header, ...bodyRows] = rows

  return (
    <Table className="my-3 text-sm">
      {header && (
        <TableHeader>
          <TableRow className="border-[var(--parchment-deep)] hover:bg-transparent">
            {header.map((cell, i) => (
              <TableHead
                key={i}
                className="h-auto px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--gold)] whitespace-normal"
              >
                {renderInline(cell, `th-${i}`)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
      )}
      <TableBody>
        {bodyRows.map((row, rowIndex) => {
          const rowClass = rollResultRowClass(row[0] ?? '')
          return (
            <TableRow
              key={rowIndex}
              className="border-[var(--parchment-deep)]/60 hover:bg-[var(--parchment-dark)]/20"
            >
              {row.map((cell, cellIndex) => (
                <TableCell
                  key={cellIndex}
                  className={cn(
                    'px-3 py-2 align-top whitespace-normal text-[var(--steel)]',
                    cellIndex === 0 && rowClass
                  )}
                >
                  {renderInline(cell, `td-${rowIndex}-${cellIndex}`)}
                </TableCell>
              ))}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export function RuleBlockContent({ body }: { body: string }) {
  const blocks = parseBody(body)

  return (
    <div className="space-y-2 text-sm leading-relaxed text-[var(--steel)]">
      {blocks.map((block, index) => {
        if (block.type === 'table') {
          return <MarkdownTable key={index} rows={block.rows} />
        }
        if (block.type === 'list') {
          return (
            <ul key={index} className="my-2 list-disc space-y-1 pl-5">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{renderInline(item, `li-${index}-${itemIndex}`)}</li>
              ))}
            </ul>
          )
        }
        return (
          <p key={index} className="mb-1">
            {renderInline(block.text, `p-${index}`)}
          </p>
        )
      })}
    </div>
  )
}
