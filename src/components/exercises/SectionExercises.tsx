import type { Exercise, ExerciseResult } from '@/types'
import ExerciseEngine from './ExerciseEngine'

interface Props {
  exercises: Exercise[]
  savedResults?: Record<string, ExerciseResult>
  onAnswer: (exerciseId: string, result: ExerciseResult) => void
}

function SectionExercises({ exercises, savedResults, onAnswer }: Props) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">四</span>
        课后练习
      </h2>
      <ExerciseEngine
        exercises={exercises}
        savedResults={savedResults}
        onAnswer={onAnswer}
      />
    </section>
  )
}

export default SectionExercises
