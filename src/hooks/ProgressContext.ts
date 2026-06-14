import { createContext, useContext } from 'react'
import type { ExerciseResult } from '@/types'

interface ProgressContextValue {
  answerExercise: (lessonId: number, exerciseId: string, result: ExerciseResult) => void
  markRead: (lessonId: number) => void
  getExerciseResults: (lessonId: number) => Record<string, ExerciseResult>
  isLessonCompleted: (lessonId: number) => boolean
  stats: {
    totalCompleted: number
    totalCorrect: number
    totalAttempted: number
  }
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function useProgressContext() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgressContext must be used within ProgressProvider')
  return ctx
}

export { ProgressContext }
