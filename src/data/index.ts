import type { CourseConfig, LessonData, ExerciseData, Exercise } from '../types'

// ===== 自动扫描 courses/ 目录 =====
const courseModules = import.meta.glob<{ default: CourseConfig }>('./courses/*/course.json', { eager: true })
const lessonModules = import.meta.glob<{ default: LessonData }>('./courses/*/lesson-[0-9][0-9].json', { eager: true })
const exerciseModules = import.meta.glob<{ default: ExerciseData }>('./courses/*/*-exercises.json', { eager: true })

// ===== 构建课程列表 =====
export interface CourseWithLessons extends CourseConfig {
  lessonData: LessonData[]
  exerciseMap: Map<number, ExerciseData>
}

function buildCourses(): CourseWithLessons[] {
  const courses: CourseWithLessons[] = []

  for (const [path, mod] of Object.entries(courseModules)) {
    const config = mod.default
    const courseId = config.id

    // 收集该课程的所有课时
    const lessonData: LessonData[] = []
    for (const [lessonPath, lessonMod] of Object.entries(lessonModules)) {
      if (lessonPath.includes(`/courses/${courseId}/`)) {
        lessonData.push(lessonMod.default)
      }
    }
    lessonData.sort((a, b) => a.meta.id - b.meta.id)

    // 收集该课程的所有练习题
    const exerciseMap = new Map<number, ExerciseData>()
    for (const [exPath, exMod] of Object.entries(exerciseModules)) {
      if (exPath.includes(`/courses/${courseId}/`)) {
        const data = exMod.default
        exerciseMap.set(data.lessonId, data)
      }
    }

    courses.push({ ...config, lessonData, exerciseMap })
  }

  // 按 course.json 中的顺序排列
  return courses
}

export const courses = buildCourses()

if (import.meta.env.DEV) {
  console.log('[SuperTeacher] courses loaded:', courses.length, courses.map(c => c.id))
}

export function getCourseById(id: string): CourseWithLessons | undefined {
  return courses.find((c) => c.id === id)
}

export function getLessonById(courseId: string, lessonId: number): LessonData | undefined {
  const course = getCourseById(courseId)
  return course?.lessonData.find((l) => l.meta.id === lessonId)
}

export function getExercisesByLessonId(courseId: string, lessonId: number): Exercise[] {
  const course = getCourseById(courseId)
  if (!course) return []
  const separate = course.exerciseMap.get(lessonId)
  if (separate) return separate.exercises
  const lesson = course.lessonData.find((l) => l.meta.id === lessonId)
  return lesson?.exercises ?? []
}
