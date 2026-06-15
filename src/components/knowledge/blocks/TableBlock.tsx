import type { TableBlock } from '@/types'

interface Props {
  block: TableBlock
}

function TableBlockComponent({ block }: Props) {
  return (
    <div className="my-3 overflow-x-auto rounded-[10px] border border-border">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-primary-bg">
            {block.headers.map((header, i) => (
              <th
                key={i}
                className="px-4 py-2.5 text-left font-semibold text-primary-dark whitespace-nowrap border-b-2 border-primary/20"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, ri) => (
            <tr key={ri} className="border-t border-border even:bg-bg hover:bg-primary-bg transition-colors">
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-2.5 text-text">
                  {cell}
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
