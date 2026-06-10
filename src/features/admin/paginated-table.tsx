'use client'

import { useState, type ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export const PAGE_SIZE = 5

const TABLE_MIN_HEIGHT = 'min-h-[17.5rem]'
const PAGINATION_MIN_HEIGHT = 'min-h-[2.5rem]'

export type PaginatedTableColumn<T> = {
  header: string
  className?: string
  cell: (item: T) => ReactNode
}

type PaginatedTableProps<T> = {
  items: T[]
  columns: PaginatedTableColumn<T>[]
  getRowKey: (item: T) => string
  emptyMessage?: string
  pageSize?: number
}

export function PaginatedTable<T>({
  items,
  columns,
  getRowKey,
  emptyMessage = 'Nenhum item nesta categoria.',
  pageSize = PAGE_SIZE,
}: PaginatedTableProps<T>) {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageItems = items.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const placeholderCount = pageSize - pageItems.length

  if (items.length === 0) {
    return (
      <div className="space-y-4">
        <div
          className={`flex ${TABLE_MIN_HEIGHT} items-center justify-center rounded-lg border border-[var(--parchment-deep)]`}
        >
          <p className="text-center text-[var(--steel-light)]">{emptyMessage}</p>
        </div>
        <div className={PAGINATION_MIN_HEIGHT} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div
        className={`rounded-lg border border-[var(--parchment-deep)] ${TABLE_MIN_HEIGHT}`}
      >
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map((column) => (
                <TableHead key={column.header} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.map((item) => (
              <TableRow key={getRowKey(item)}>
                {columns.map((column) => (
                  <TableCell key={column.header} className={column.className}>
                    {column.cell(item)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {Array.from({ length: placeholderCount }, (_, index) => (
              <TableRow key={`placeholder-${index}`} className="hover:bg-transparent">
                {columns.map((column) => (
                  <TableCell key={column.header} className={column.className}>
                    {'\u00A0'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className={`flex ${PAGINATION_MIN_HEIGHT} items-center justify-between gap-4`}>
        <p className="text-sm text-[var(--steel-light)]">
          Página {currentPage} de {totalPages} · {items.length} itens
        </p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Anterior
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  )
}
