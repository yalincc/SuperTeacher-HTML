import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import type { KnowledgeSection } from '@/types'
import ContentRenderer from './ContentRenderer'

interface Props {
  sections: KnowledgeSection[]
}

function SectionKnowledge({ sections }: Props) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-text mb-3 flex items-center gap-2">
        <span className="w-6 h-6 bg-primary-bg text-primary rounded-full flex items-center justify-center text-xs font-bold">二</span>
        知识点梳理
      </h2>
      <div className="space-y-3">
        {sections.map((section, i) => (
          <KnowledgePanel key={i} section={section} index={i} />
        ))}
      </div>
    </section>
  )
}

interface PanelProps {
  section: KnowledgeSection
  index: number
}

function KnowledgePanel({ section, index }: PanelProps) {
  const [expanded, setExpanded] = useState(section.defaultExpanded)

  return (
    <div className="bg-surface-warm rounded-r-[10px] border-l-4 border-primary overflow-hidden animate-slide-up">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/40 transition"
      >
        <span className="font-medium text-text flex items-center gap-2">
          <span className="text-xs text-text-muted">{index + 1}.</span>
          {section.title}
        </span>
        {expanded ? (
          <ChevronDown className="w-4 h-4 text-text-muted" />
        ) : (
          <ChevronRight className="w-4 h-4 text-text-muted" />
        )}
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-primary/10">
          <ContentRenderer blocks={section.blocks} />
        </div>
      )}
    </div>
  )
}

export default SectionKnowledge
