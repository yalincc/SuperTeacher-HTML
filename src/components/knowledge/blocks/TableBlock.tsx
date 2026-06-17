import type { TableBlock } from '@/types'
import { renderInline } from '@/utils/renderInline'

interface Props {
  block: TableBlock
}

function TableBlockComponent({ block }: Props) {
  return (
    <div className="my-5 overflow-x-auto rounded-2xl border border-border shadow-sm">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-bg/80">
            {block.headers.map((header, i) => (
              <th
                key={i}
                className="px-5 py-3 text-left font-semibold text-text whitespace-nowrap border-b border-border"
              >
                {renderInline(header)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, ri) => (
            <tr key={ri} className="border-t border-border/60 even:bg-bg/40 hover:bg-primary-bg/40 transition-colors">
              {row.map((cell, ci) => (
                <td key={ci} className="px-5 py-3 text-text-secondary leading-relaxed">
                  {renderInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TableBlockComponent
