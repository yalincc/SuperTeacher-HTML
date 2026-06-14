import { useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import type { ChoiceExercise as ChoiceType, ExerciseResult } from '@/types'
import AnswerReveal from '../AnswerReveal'

interface Props {
  exercise: ChoiceType
  savedResult?: ExerciseResult
  onAnswer: (result: ExerciseResult) => void
}

function ChoiceExercise({ exercise, savedResult, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(
    savedResult?.answered ? savedResult.userAnswer : null
  )
  const [submitted, setSubmitted] = useState(savedResult?.answered ?? false)

  const isCorrect = submitted && selected === exercise.answer

  function handleSelect(label: string) {
    if (submitted) return // 已提交不可更改
    setSelected(label)
  }

  function handleSubmit() {
    if (!selected || submitted) return
    setSubmitted(true)
    onAnswer({
      answered: true,
      correct: selected === exercise.answer,
      userAnswer: selected,
      timestamp: Date.now(),
    })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 my-3">
      {/* 题干 */}
      <div className="mb-3">
        <span className="text-sm font-medium text-gray-800">{exercise.stem}</span>
        {exercise.source && (
          <span className="ml-2 text-xs text-gray-400">（{exercise.source}）</span>
        )}
      </div>

      {/* 选项 */}
      <div className="space-y-2">
        {exercise.options.map((opt) => {
          const isSelected = selected === opt.label
          const isAnswer = exercise.answer === opt.label
          let style = 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'

          if (submitted) {
            if (isAnswer) {
              style = 'border-green-500 bg-green-50'
            } else if (isSelected && !isAnswer) {
              style = 'border-red-500 bg-red-50'
            } else {
              style = 'border-gray-200 opacity-60'
            }
          } else if (isSelected) {
            style = 'border-blue-500 bg-blue-50'
          }

          return (
            <button
              key={opt.label}
              onClick={() => handleSelect(opt.label)}
              disabled={submitted}
              className={`w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-lg border-2 transition ${style}`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                submitted && isAnswer ? 'bg-green-500 text-white' :
                submitted && isSelected && !isAnswer ? 'bg-red-500 text-white' :
                isSelected ? 'bg-blue-500 text-white' :
                'bg-gray-100 text-gray-600'
              }`}>
                {submitted && isAnswer ? <CheckCircle2 className="w-4 h-4" /> :
                 submitted && isSelected && !isAnswer ? <XCircle className="w-4 h-4" /> :
                 opt.label}
              </span>
              <span className="text-sm text-gray-700">{opt.text}</span>
            </button>
          )
        })}
      </div>

      {/* 提交按钮 */}
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!selected}
          className="mt-3 px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          提交答案
        </button>
      )}

      {/* 判题结果 */}
      {submitted && (
        <div className={`mt-3 px-3 py-2 rounded-lg text-sm ${
          isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {isCorrect ? '✅ 回答正确！' : `❌ 回答错误，正确答案是 ${exercise.answer}`}
        </div>
      )}

      {/* 解析 */}
      {submitted && <AnswerReveal analysis={exercise.analysis} />}
    </div>
  )
}

export default ChoiceExercise
