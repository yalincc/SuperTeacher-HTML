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

  // 按 order 字段排序（默认 99）
  courses.sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
  return courses
}

export const courses = buildCourses()

if (import.meta.env.DEV) {
  console.log('[SuperTeacher] courses loaded:', courses.length, courses.map(c => c.id))
}

// ===== 学期分组 =====
export interface CourseGroup {
  id: string
  name: string
  icon: string
  color: string
  order: number
  courses: CourseWithLessons[]
}

function buildGroups(): CourseGroup[] {
  const map = new Map<string, CourseGroup>()
  for (const course of courses) {
    if (!course.group) continue
    const g = course.group
    if (!map.has(g.id)) {
      map.set(g.id, { id: g.id, name: g.name, icon: g.icon, color: g.color, order: g.order, courses: [] })
    }
    map.get(g.id)!.courses.push(course)
  }
  // 每学期内按 semester.order 排序
  for (const group of map.values()) {
    group.courses.sort((a, b) => (a.semester?.order ?? 99) - (b.semester?.order ?? 99))
  }
  return Array.from(map.values()).sort((a, b) => a.order - b.order)
}

const groups = buildGroups()

export function getGroups(): CourseGroup[] {
  return groups
}

export function getGroupById(id: string): CourseGroup | undefined {
  return groups.find((g) => g.id === id)
}

export function isGroupId(id: string): boolean {
  return groups.some((g) => g.id === id)
}

// ===== 首页展示列表 =====
export type HomeDisplayItem =
  | { kind: 'course'; course: CourseWithLessons }
  | { kind: 'group'; group: CourseGroup }

export function getHomeDisplayItems(): HomeDisplayItem[] {
  const groupedCourseIds = new Set<string>()
  for (const g of groups) {
    for (const c of g.courses) groupedCourseIds.add(c.id)
  }

  const items: HomeDisplayItem[] = []
  for (const course of courses) {
    if (!groupedCourseIds.has(course.id)) {
      items.push({ kind: 'course', course })
    }
  }
  for (const group of groups) {
    items.push({ kind: 'group', group })
  }
  // 统一按 order 排序
  items.sort((a, b) => {
    const orderA = a.kind === 'course' ? (a.course.order ?? 99) : a.group.order
    const orderB = b.kind === 'course' ? (b.course.order ?? 99) : b.group.order
    return orderA - orderB
  })
  return items
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
