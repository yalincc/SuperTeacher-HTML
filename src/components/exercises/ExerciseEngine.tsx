import { useEffect, useMemo, useState } from 'react'
import type { Exercise, ExerciseResult } from '@/types'
import ChoiceExerciseComp from './types/ChoiceExercise'
import TrueFalseExerciseComp from './types/TrueFalseExercise'
import FillExerciseComp from './types/FillExercise'
import ShortAnswerExerciseComp from './types/ShortAnswerExercise'
import AnswerAnimation from './AnswerAnimation'

interface Props {
  exercises: Exercise[]
  savedResults?: Record<string, ExerciseResult>
  onAnswer: (exerciseId: string, result: ExerciseResult) => void
  onComplete?: () => void
  onWrongAnswer?: () => void
  correctGif?: string
  wrongGif?: string
}

function ExerciseEngine({ exercises, savedResults, onAnswer, onComplete, onWrongAnswer, correctGif, wrongGif }: Props) {
  const [animation, setAnimation] = useState<'correct' | 'wrong' | null>(null)

  const allCompleted = useMemo(() => {
    if (!savedResults) return false
    return exercises.every((ex) => savedResults[ex.id]?.answered)
  }, [exercises, savedResults])

  useEffect(() => {
    if (allCompleted && onComplete) {
      onComplete()
    }
  }, [allCompleted, onComplete])

  function handleAnswer(exerciseId: string, result: ExerciseResult) {
    onAnswer(exerciseId, result)
    if (result.correct) {
      setAnimation('correct')
    } else {
      setAnimation('wrong')
      onWrongAnswer?.()
    }
  }

  return (
    <div>
      {animation && (
        <AnswerAnimation
          type={animation}
          gifSrc={animation === 'correct' ? correctGif : wrongGif}
          onComplete={() => setAnimation(null)}
        />
      )}
      {exercises.map((ex) => {
        const saved = savedResults?.[ex.id]
        const handleExAnswer = (result: ExerciseResult) => handleAnswer(ex.id, result)

        switch (ex.type) {
          case 'choice':
            return (
              <ChoiceExerciseComp
                key={ex.id}
                exercise={ex}
                savedResult={saved}
                onAnswer={handleExAnswer}
              />
            )
          case 'true_false':
            return (
              <TrueFalseExerciseComp
                key={ex.id}
                exercise={ex}
                savedResult={saved}
                onAnswer={handleExAnswer}
              />
            )
          case 'fill':
            return (
              <FillExerciseComp
                key={ex.id}
                exercise={ex}
                savedResult={saved}
                onAnswer={handleExAnswer}
              />
            )
          case 'short_answer':
            return (
              <ShortAnswerExerciseComp
                key={ex.id}
                exercise={ex}
                savedResult={saved}
                onAnswer={handleExAnswer}
              />
            )
          default:
            return (
              <p key={ex.id} className="text-red-400 text-sm italic">
                未知题型: {(ex as Exercise).type}
              </p>
            )
        }
      })}
    </div>
  )
}

export default ExerciseEngine
