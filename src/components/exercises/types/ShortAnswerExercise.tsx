import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { ShortAnswerExercise as SAType, ExerciseResult } from '@/types'
import { renderInline } from '@/utils/renderInline'

interface Props {
  exercise: SAType
  savedResult?: ExerciseResult
  onAnswer: (result: ExerciseResult) => void
}

type SelfRating = 'mastered' | 'partial' | 'not_mastered'

function ShortAnswerExercise({ exercise, savedResult, onAnswer }: Props) {
  const [answer, setAnswer] = useState(savedResult?.userAnswer || '')
  const [showRef, setShowRef] = useState(false)
  const [rating, setRating] = useState<SelfRating | null>(
    savedResult?.answered ? (savedResult.userAnswer as SelfRating) || null : null
  )

  function handleShowReference() {
    setShowRef(true)
  }

  function handleSelfRate(level: SelfRating) {
    setRating(level)
    onAnswer({
      answered: true,
      correct: level === 'mastered',
      userAnswer: level,
      timestamp: Date.now(),
    })
  }

  const ratingLabels: Record<SelfRating, { text: string; style: string }> = {
    mastered: { text: '已掌握', style: 'bg-green-100 text-green-700 border-green-300' },
    partial: { text: '部分掌握', style: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
    not_mastered: { text: '未掌握', style: 'bg-red-100 text-red-700 border-red-300' },
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 my-3">
      {/* 题干 */}
      <div className="mb-3 text-sm font-medium text-gray-800">
        {renderInline(exercise.question)}
      </div>

      {/* 文本输入框 */}
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="在此输入你的答案..."
        className="w-full h-24 px-3 py-2 text-sm border border-gray-300 rounded-lg resize-none focus:border-blue-500 focus:outline-none"
      />

      {/* 查看参考答案按钮 */}
      {!showRef && (
        <button
          onClick={handleShowReference}
          className="mt-3 px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
        >
          查看参考答案
        </button>
      )}

      {/* 参考答案 */}
      {showRef && (
        <div className="mt-3">
          <div className="bg-blue-50 rounded-lg p-3 mb-3">
            <div className="text-xs font-semibold text-blue-600 mb-1">参考答案</div>
            <p className="text-sm text-gray-700 leading-relaxed">{renderInline(exercise.referenceAnswer)}</p>
            {exercise.scoringPoints && exercise.scoringPoints.length > 0 && (
              <div className="mt-2">
                <div className="text-xs font-semibold text-blue-600 mb-1">得分要点</div>
                <ul className="text-sm text-gray-600 space-y-0.5">
                  {exercise.scoringPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <span className="text-blue-400">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 自评按钮 */}
          {!rating && (
            <div>
              <p className="text-xs text-gray-500 mb-2">对照参考答案，给自己的回答打分：</p>
              <div className="flex gap-2">
                {(Object.keys(ratingLabels) as SelfRating[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => handleSelfRate(level)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition ${ratingLabels[level].style}`}
                  >
                    {ratingLabels[level].text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 已自评 */}
          {rating && (
            <div className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border ${ratingLabels[rating].style}`}>
              自评结果：{ratingLabels[rating].text}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ShortAnswerExercise
