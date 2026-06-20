import type { TimelineBlock } from '@/types'

interface Props {
  block: TimelineBlock
}

function TimelineBlockComponent({ block }: Props) {
  return (
    <div className="my-5 animate-slide-up">
      <div className="relative pl-6 border-l-2 border-amber-300 space-y-4">
        {block.items.map((item, i) => (
          <div key={i} className="relative">
            {/* 时间节点圆点 */}
            <div className="absolute -left-[25px] top-1.5 w-3 h-3 rounded-full bg-amber-400 border-2 border-white shadow-sm" />

            <div className="ml-2">
              <span className="inline-block text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full mb-1">
                {item.time}
              </span>
              <div className="font-semibold text-text text-sm">{item.title}</div>
              {item.content && (
                <p className="text-text-secondary text-sm mt-0.5 leading-relaxed">{item.content}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TimelineBlockComponent
