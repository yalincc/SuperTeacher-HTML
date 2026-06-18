import { useState, useCallback, useMemo } from 'react'
import type { UserProgress, ExerciseResult } from '@/types'
import {
  loadProgress,
  updateExerciseResult,
  getLessonProgress,
  markKnowledgeRead,
} from '@/utils/storage'

export function useProgress(courseId: string) {
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress(courseId))

  const answerExercise = useCallback(
    (lessonId: number, exerciseId: string, result: ExerciseResult) => {
      setProgress((prev) => {
        const next = updateExerciseResult(
          courseId,
          structuredClone(prev),
          lessonId,
          exerciseId,
          result
        )
        return next
      })
    },
    [courseId]
  )

  const markRead = useCallback((lessonId: number) => {
    setProgress((prev) => {
      const next = markKnowledgeRead(courseId, structuredClone(prev), lessonId)
      return next
    })
  }, [courseId])

  const getExerciseResults = useCallback(
    (lessonId: number): Record<string, ExerciseResult> => {
      const lp = getLessonProgress(progress, lessonId)
      return lp?.exerciseResults || {}
    },
    [progress]
  )

  const isLessonCompleted = useCallback(
    (lessonId: number): boolean => {
      const lp = getLessonProgress(progress, lessonId)
      return !!lp?.completedAt
    },
    [progress]
  )

  const stats = useMemo(() => progress.stats, [progress])

  return {
    courseId,
    progress,
    answerExercise,
    markRead,
    getExerciseResults,
    isLessonCompleted,
    stats,
  }
}
