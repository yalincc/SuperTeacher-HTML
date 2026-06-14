import type { SummaryNode } from '@/types'

interface Props {
  summary: SummaryNode[]
}

function SectionSummary({ summary }: Props) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">五</span>
        本课小结
      </h2>
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <SummaryTree nodes={summary} level={0} />
      </div>
    </section>
  )
}

interface TreeProps {
  nodes: SummaryNode[]
  level: number
}

function SummaryTree({ nodes, level }: TreeProps) {
  return (
    <ul className={`${level > 0 ? 'ml-5 mt-1' : ''} space-y-1`}>
      {nodes.map((node, i) => (
        <li key={i} className="flex items-start gap-1.5">
          <span className={`shrink-0 mt-1 ${level === 0 ? 'text-blue-500' : 'text-gray-400'}`}>
            {level === 0 ? '●' : '○'}
          </span>
          <span className={`text-sm ${level === 0 ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
            {node.text}
          </span>
          {node.children && <SummaryTree nodes={node.children} level={level + 1} />}
        </li>
      ))}
    </ul>
  )
}

export default SectionSummary
