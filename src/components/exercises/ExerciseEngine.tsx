import type { Exercise, ExerciseResult } from '@/types'
import ChoiceExerciseComp from './types/ChoiceExercise'
import TrueFalseExerciseComp from './types/TrueFalseExercise'
import FillExerciseComp from './types/FillExercise'
import ShortAnswerExerciseComp from './types/ShortAnswerExercise'

interface Props {
  exercises: Exercise[]
  savedResults?: Record<string, ExerciseResult>
  onAnswer: (exerciseId: string, result: ExerciseResult) => void
}

function ExerciseEngine({ exercises, savedResults, onAnswer }: Props) {
  return (
    <div>
      {exercises.map((ex) => {
        const saved = savedResults?.[ex.id]
        const handleAnswer = (result: ExerciseResult) => onAnswer(ex.id, result)

        switch (ex.type) {
          case 'choice':
            return (
              <ChoiceExerciseComp
                key={ex.id}
                exercise={ex}
                savedResult={saved}
                onAnswer={handleAnswer}
              />
            )
          case 'true_false':
            return (
              <TrueFalseExerciseComp
                key={ex.id}
                exercise={ex}
                savedResult={saved}
                onAnswer={handleAnswer}
              />
            )
          case 'fill':
            return (
              <FillExerciseComp
                key={ex.id}
                exercise={ex}
                savedResult={saved}
                onAnswer={handleAnswer}
              />
            )
          case 'short_answer':
            return (
              <ShortAnswerExerciseComp
                key={ex.id}
                exercise={ex}
                savedResult={saved}
                onAnswer={handleAnswer}
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
