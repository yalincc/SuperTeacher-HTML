import { useState } from 'react'
import type { FillExercise as FillType, ExerciseResult } from '@/types'
import { checkAnswer } from '@/utils/formula'
import AnswerReveal from '../AnswerReveal'
import { renderInline } from '@/utils/renderInline'

interface Props {
  exercise: FillType
  savedResult?: ExerciseResult
  onAnswer: (result: ExerciseResult) => void
}

function FillExercise({ exercise, savedResult, onAnswer }: Props) {
  const savedAnswers = savedResult?.answered ? savedResult.userAnswer.split('|||') : []

  const [values, setValues] = useState<string[]>(
    savedResult?.answered
      ? savedAnswers
      : exercise.blanks.map(() => '')
  )
  const [submitted, setSubmitted] = useState(savedResult?.answered ?? false)
  const [results, setResults] = useState<boolean[]>(
    submitted
      ? exercise.blanks.map((blank, i) =>
          checkAnswer(savedAnswers[i] || '', blank.answer, blank.alternatives)
        )
      : []
  )

  const allCorrect = submitted && results.every(Boolean)

  function handleChange(index: number, value: string) {
    if (submitted) return
    const newValues = [...values]
    newValues[index] = value
    setValues(newValues)
  }

  function handleSubmit() {
    if (submitted) return
    const checkResults = exercise.blanks.map((blank, i) =>
      checkAnswer(values[i] || '', blank.answer, blank.alternatives)
    )
    setResults(checkResults)
    setSubmitted(true)
    onAnswer({
      answered: true,
      correct: checkResults.every(Boolean),
      userAnswer: values.join('|||'),
      timestamp: Date.now(),
    })
  }

  // 渲染 segments，将 ___N___ 替换为输入框
  function renderSegments() {
    return exercise.segments.map((segment, i) => {
      const blankMatch = segment.match(/^___(\d+)___$/)
      if (blankMatch) {
        const blankIndex = parseInt(blankMatch[1], 10) - 1
        const isResult = submitted ? results[blankIndex] : undefined
        return (
          <input
            key={i}
            type="text"
            value={values[blankIndex] || ''}
            onChange={(e) => handleChange(blankIndex, e.target.value)}
            disabled={submitted}
            className={`inline-block w-20 sm:w-24 mx-1 px-2 py-1 text-sm border-2 rounded-md transition ${
              isResult === true
                ? 'border-green-500 bg-green-50'
                : isResult === false
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300 focus:border-blue-500 focus:outline-none'
            }`}
          />
        )
      }
      return <span key={i}>{renderInline(segment)}</span>
    })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 my-3">
      {/* 题干（含输入框） */}
      <div className="mb-3 text-sm text-gray-700 leading-loose">
        {exercise.source && (
          <span className="text-xs text-gray-400 mr-2">（{exercise.source}）</span>
        )}
        {renderSegments()}
      </div>

      {/* 提交按钮 */}
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={values.every((v) => !v.trim())}
          className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          提交答案
        </button>
      )}

      {/* 判题结果 + 正确答案 */}
      {submitted && (
        <div className={`mt-3 px-3 py-2 rounded-lg text-sm ${
          allCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {allCorrect ? '✅ 全部正确！' : (
            <span>
              ❌ 正确答案：
              {exercise.blanks.map((blank, i) => (
                <span key={i} className="ml-1">
                  第{blank.index}空 = <strong>{renderInline(blank.answer)}</strong>
                  {i < exercise.blanks.length - 1 ? '，' : ''}
                </span>
              ))}
            </span>
          )}
        </div>
      )}

      {/* 解析 */}
      {submitted && <AnswerReveal analysis={exercise.analysis} />}
    </div>
  )
}

export default FillExercise
