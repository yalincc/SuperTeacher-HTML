import { useState, useCallback, useMemo } from 'react'
import type { UserProgress, ExerciseResult } from '@/types'
import {
  loadProgress,
  saveProgress,
  updateExerciseResult,
  getLessonProgress,
  markKnowledgeRead,
} from '@/utils/storage'

/**
 * 进度管理 Hook
 * 封装 localStorage 读写，每次更新自动持久化
 */
export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress())

  /** 回答一道练习题 */
  const answerExercise = useCallback(
    (lessonId: number, exerciseId: string, result: ExerciseResult) => {
      setProgress((prev) => {
        const next = updateExerciseResult(
          structuredClone(prev),
          lessonId,
          exerciseId,
          result
        )
        saveProgress(next)
        return next
      })
    },
    []
  )

  /** 标记知识点已读 */
  const markRead = useCallback((lessonId: number) => {
    setProgress((prev) => {
      const next = markKnowledgeRead(structuredClone(prev), lessonId)
      saveProgress(next)
      return next
    })
  }, [])

  /** 获取某课时的练习结果 */
  const getExerciseResults = useCallback(
    (lessonId: number): Record<string, ExerciseResult> => {
      const lp = getLessonProgress(progress, lessonId)
      return lp?.exerciseResults || {}
    },
    [progress]
  )

  /** 某课时是否完成 */
  const isLessonCompleted = useCallback(
    (lessonId: number): boolean => {
      const lp = getLessonProgress(progress, lessonId)
      return !!lp?.completedAt
    },
    [progress]
  )

  /** 全局统计 */
  const stats = useMemo(() => progress.stats, [progress])

  return {
    progress,
    answerExercise,
    markRead,
    getExerciseResults,
    isLessonCompleted,
    stats,
  }
}
