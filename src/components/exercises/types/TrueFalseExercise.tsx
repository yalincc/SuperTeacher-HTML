import { useState } from 'react'
import type { TrueFalseExercise as TFType, ExerciseResult } from '@/types'
import AnswerReveal from '../AnswerReveal'

interface Props {
  exercise: TFType
  savedResult?: ExerciseResult
  onAnswer: (result: ExerciseResult) => void
}

function TrueFalseExercise({ exercise, savedResult, onAnswer }: Props) {
  const [selected, setSelected] = useState<boolean | null>(
    savedResult?.answered ? savedResult.userAnswer === 'true' : null
  )
  const [submitted, setSubmitted] = useState(savedResult?.answered ?? false)

  const isCorrect = submitted && selected === exercise.answer

  function handleSelect(value: boolean) {
    if (submitted) return
    setSelected(value)
  }

  function handleSubmit() {
    if (selected === null || submitted) return
    setSubmitted(true)
    onAnswer({
      answered: true,
      correct: selected === exercise.answer,
      userAnswer: String(selected),
      timestamp: Date.now(),
    })
  }

  const buttons = [
    { value: true, label: '✓ 对', correct: exercise.answer === true },
    { value: false, label: '✗ 错', correct: exercise.answer === false },
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 my-3">
      {/* 题干 */}
      <div className="mb-3">
        <span className="text-sm font-medium text-gray-800">{exercise.stem}</span>
        {exercise.source && (
          <span className="ml-2 text-xs text-gray-400">（{exercise.source}）</span>
        )}
      </div>

      {/* 对/错 按钮 */}
      <div className="flex gap-3">
        {buttons.map((btn) => {
          const isSelected = selected === btn.value
          let style = 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'

          if (submitted) {
            if (btn.correct) {
              style = 'border-green-500 bg-green-50'
            } else if (isSelected && !btn.correct) {
              style = 'border-red-500 bg-red-50'
            } else {
              style = 'border-gray-200 opacity-60'
            }
          } else if (isSelected) {
            style = 'border-blue-500 bg-blue-50'
          }

          return (
            <button
              key={String(btn.value)}
              onClick={() => handleSelect(btn.value)}
              disabled={submitted}
              className={`flex-1 py-2.5 rounded-lg border-2 text-sm font-medium transition ${style}`}
            >
              {btn.label}
            </button>
          )
        })}
      </div>

      {/* 提交按钮 */}
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
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
          {isCorrect ? '✅ 回答正确！' : `❌ 回答错误，正确答案是「${exercise.answer ? '对' : '错'}」`}
        </div>
      )}

      {/* 解析 */}
      {submitted && <AnswerReveal analysis={exercise.analysis} />}
    </div>
  )
}

export default TrueFalseExercise
