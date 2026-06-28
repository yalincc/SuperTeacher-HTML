import { useState } from 'react'
import { Eye, EyeOff, BookOpen } from 'lucide-react'
import type { Example } from '@/types'
import ContentRenderer from './ContentRenderer'
import { renderInline } from '@/utils/renderInline'

interface Props {
  examples: Example[]
}

function SectionExamples({ examples }: Props) {
  return (
    <div className="space-y-4">
      {examples.map((example, i) => (
        <ExampleCard key={i} example={example} index={i} />
      ))}
    </div>
  )
}

function ExampleCard({ example, index }: { example: Example; index: number }) {
  const [showAnswer, setShowAnswer] = useState(false)

  return (
    <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
      {/* 题目区 */}
      <div className="px-6 py-5">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
            {index + 1}
          </span>
          <span className="font-semibold text-text text-base">{example.title}</span>
          {example.source && (
            <span className="ml-auto text-xs text-text-muted bg-bg px-2.5 py-1 rounded-full">
              {example.source}
            </span>
          )}
        </div>
        <ContentRenderer blocks={example.problem} />
      </div>

      {/* 答案/解析区 */}
      <div className="border-t border-border">
        {/* 切换按钮 */}
        <div className="flex justify-center py-3">
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary-bg text-primary text-sm font-medium hover:bg-primary/10 transition-all"
          >
            {showAnswer ? (
              <>
                <EyeOff className="w-4 h-4" />
                隐藏答案
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                显示答案与解析
              </>
            )}
          </button>
        </div>

        {/* 展开内容 */}
        {showAnswer && (
          <div className="px-6 pb-6 animate-[tab-fade-in_0.25s_ease-out]">
            {/* 答案 */}
            <div className="flex items-center gap-3 px-5 py-3.5 bg-success-bg rounded-2xl mb-4">
              <span className="text-success text-sm font-bold">答案</span>
              <span className="text-base text-text font-medium">{renderInline(example.answer)}</span>
            </div>

            {/* 解析 */}
            <div className="pl-4 border-l-2 border-border">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-text-secondary" />
                <span className="text-sm font-semibold text-text-secondary">解题思路</span>
              </div>
              <ContentRenderer blocks={example.solution} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SectionExamples
