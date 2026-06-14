import type { LessonData } from '../types'

import lesson1 from './lessons/lesson-01.json'
import lesson2 from './lessons/lesson-02.json'
import lesson3 from './lessons/lesson-03.json'
import lesson4 from './lessons/lesson-04.json'
import lesson5 from './lessons/lesson-05.json'
import lesson6 from './lessons/lesson-06.json'

export const lessonIndex: LessonData[] = [
  lesson1 as LessonData,
  lesson2 as LessonData,
  lesson3 as LessonData,
  lesson4 as LessonData,
  lesson5 as LessonData,
  lesson6 as LessonData,
]

export function getLessonById(id: number): LessonData | undefined {
  return lessonIndex.find((l) => l.meta.id === id)
}
