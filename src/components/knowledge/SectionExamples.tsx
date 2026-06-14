import type { Example } from '@/types'
import ContentRenderer from './ContentRenderer'

interface Props {
  examples: Example[]
}

function SectionExamples({ examples }: Props) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">三</span>
        典型例题
      </h2>
      <div className="space-y-4">
        {examples.map((example, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-0.5 rounded">
                {example.title}
              </span>
              {example.source && (
                <span className="text-xs text-gray-400">来源：{example.source}</span>
              )}
            </div>
            {/* 题干 */}
            <ContentRenderer blocks={example.problem} />
            {/* 答案 + 解析 */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-green-600">答案：{example.answer}</span>
              </div>
              <details className="group">
                <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800 font-medium">
                  查看解析
                </summary>
                <div className="mt-2 pl-3 border-l-2 border-blue-200">
                  <ContentRenderer blocks={example.solution} />
                </div>
              </details>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default SectionExamples
