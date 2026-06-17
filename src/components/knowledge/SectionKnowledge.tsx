import type { KnowledgeSection } from '@/types'
import ContentRenderer from './ContentRenderer'

interface Props {
  sections: KnowledgeSection[]
}

function SectionKnowledge({ sections }: Props) {
  return (
    <div className="space-y-4">
      {sections.map((section, i) => (
        <KnowledgeCard key={i} section={section} index={i} />
      ))}
    </div>
  )
}

function KnowledgeCard({ section, index }: { section: KnowledgeSection; index: number }) {
  return (
    <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
      {/* 卡片标题行 */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border/60">
        <span className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
          {index + 1}
        </span>
        <h3 className="font-semibold text-text text-base">{section.title}</h3>
      </div>

      {/* 卡片内容 */}
      <div className="px-6 py-5">
        <ContentRenderer blocks={section.blocks} />
      </div>
    </div>
  )
}

export default SectionKnowledge
