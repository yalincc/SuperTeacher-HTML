import { Star } from 'lucide-react'
import type { Objective } from '@/types'
import { renderInline } from '@/utils/renderInline'

interface Props {
  objectives: Objective[]
}

function SectionObjectives({ objectives }: Props) {
  const keyPoints = objectives.filter((o) => o.isKeyPoint)
  const normalPoints = objectives.filter((o) => !o.isKeyPoint)

  return (
    <div className="space-y-3">
      {/* 重点目标 — 大卡片 */}
      {keyPoints.map((obj, i) => (
        <div
          key={`key-${i}`}
          className="flex items-start gap-4 px-6 py-5 bg-surface-warm border border-primary/15 rounded-2xl"
        >
          <Star className="w-5 h-5 text-warning fill-warning shrink-0 mt-0.5" />
          <span className="text-base text-text font-medium leading-relaxed">{renderInline(obj.text)}</span>
        </div>
      ))}

      {/* 普通目标 — 简洁行 */}
      {normalPoints.map((obj, i) => (
        <div
          key={`normal-${i}`}
          className="flex items-center gap-3 px-6 py-3"
        >
          <span className="w-2 h-2 rounded-full bg-text-muted shrink-0" />
          <span className="text-base text-text-secondary leading-relaxed">{renderInline(obj.text)}</span>
        </div>
      ))}
    </div>
  )
}

export default SectionObjectives
