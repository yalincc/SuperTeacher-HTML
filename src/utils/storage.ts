import type { UserProgress, LessonProgress, ExerciseResult, ProgressStats } from '../types'

function getStorageKey(courseId: string): string {
  return `superteacher_progress_${courseId}`
}

function createEmptyProgress(): UserProgress {
  return {
    version: 1,
    lessons: {},
    stats: {
      totalCompleted: 0,
      totalCorrect: 0,
      totalAttempted: 0,
      wrongExercises: [],
    },
  }
}

/** 从 localStorage 读取进度 */
export function loadProgress(courseId: string): UserProgress {
  try {
    const raw = localStorage.getItem(getStorageKey(courseId))
    if (!raw) return createEmptyProgress()
    const data = JSON.parse(raw) as UserProgress
    if (data.version !== 1) return createEmptyProgress()
    return data
  } catch {
    return createEmptyProgress()
  }
}

/** 保存进度到 localStorage */
export function saveProgress(courseId: string, progress: UserProgress): void {
  localStorage.setItem(getStorageKey(courseId), JSON.stringify(progress))
}

/** 获取某课时的进度 */
export function getLessonProgress(
  progress: UserProgress,
  lessonId: number
): LessonProgress | undefined {
  return progress.lessons[String(lessonId)]
}

/** 更新某课时的某道练习结果，并重新计算统计 */
export function updateExerciseResult(
  courseId: string,
  progress: UserProgress,
  lessonId: number,
  exerciseId: string,
  result: ExerciseResult
): UserProgress {
  const key = String(lessonId)
  const lessonProgress = progress.lessons[key] || {
    knowledgeRead: false,
    exerciseResults: {},
  }

  lessonProgress.exerciseResults[exerciseId] = result

  const results = Object.values(lessonProgress.exerciseResults)
  if (results.every((r) => r.answered)) {
    lessonProgress.completedAt = Date.now()
  }

  progress.lessons[key] = lessonProgress
  progress.stats = recalculateStats(progress)

  saveProgress(courseId, progress)
  return progress
}

/** 标记知识点已阅读 */
export function markKnowledgeRead(
  courseId: string,
  progress: UserProgress,
  lessonId: number
): UserProgress {
  const key = String(lessonId)
  const lessonProgress = progress.lessons[key] || {
    knowledgeRead: false,
    exerciseResults: {},
  }
  lessonProgress.knowledgeRead = true
  progress.lessons[key] = lessonProgress
  saveProgress(courseId, progress)
  return progress
}

/** 重新计算全局统计 */
function recalculateStats(progress: UserProgress): ProgressStats {
  let totalCompleted = 0
  let totalCorrect = 0
  let totalAttempted = 0
  const wrongExercises: ProgressStats['wrongExercises'] = []

  for (const [lessonIdStr, lp] of Object.entries(progress.lessons)) {
    const lessonId = Number(lessonIdStr)
    const results = Object.entries(lp.exerciseResults)

    for (const [exerciseId, result] of results) {
      if (result.answered) {
        totalAttempted++
        if (result.correct) {
          totalCorrect++
        } else {
          wrongExercises.push({
            lessonId,
            exerciseId,
            userAnswer: result.userAnswer,
            timestamp: result.timestamp,
          })
        }
      }
    }

    if (lp.completedAt) {
      totalCompleted++
    }
  }

  return { totalCompleted, totalCorrect, totalAttempted, wrongExercises }
}

/** 重置某课程进度 */
export function resetProgress(courseId: string): void {
  localStorage.removeItem(getStorageKey(courseId))
}
