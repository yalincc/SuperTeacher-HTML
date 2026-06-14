import type { TableBlock } from '@/types'

interface Props {
  block: TableBlock
}

function TableBlockComponent({ block }: Props) {
  return (
    <div className="my-3 overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            {block.headers.map((header, i) => (
              <th
                key={i}
                className="px-4 py-2 text-left font-semibold text-gray-700 whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, ri) => (
            <tr key={ri} className="border-t border-gray-100 hover:bg-gray-50">
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-2 text-gray-600">
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
