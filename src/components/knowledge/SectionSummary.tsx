import type { SummaryNode } from '@/types'
import { renderInline } from '@/utils/renderInline'

interface Props {
  summary: SummaryNode[]
}

function SectionSummary({ summary }: Props) {
  return (
    <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
      <SummaryTree nodes={summary} level={0} />
    </div>
  )
}

interface TreeProps {
  nodes: SummaryNode[]
  level: number
}

function SummaryTree({ nodes, level }: TreeProps) {
  return (
    <ul className={`${level > 0 ? 'ml-5 mt-2 border-l border-border/50 pl-3' : ''} space-y-2`}>
      {nodes.map((node, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <span className={`shrink-0 mt-1.5 ${level === 0 ? 'w-2.5 h-2.5 rounded-full bg-primary' : 'w-2 h-2 rounded-full bg-text-muted'}`} />
          <div>
            <span className={`${level === 0 ? 'text-base font-semibold text-text' : 'text-sm text-text-secondary'} leading-relaxed`}>
              {renderInline(node.text)}
            </span>
          </div>
          {node.children && <SummaryTree nodes={node.children} level={level + 1} />}
        </li>
      ))}
    </ul>
  )
}

export default SectionSummary
