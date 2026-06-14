import type { LessonData } from '../types'

import lesson1 from './lessons/lesson-01.json'
import lesson2 from './lessons/lesson-02.json'

export const lessonIndex: LessonData[] = [
  lesson1 as LessonData,
  lesson2 as LessonData,
]

export function getLessonById(id: number): LessonData | undefined {
  return lessonIndex.find((l) => l.meta.id === id)
}
