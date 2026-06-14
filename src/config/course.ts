import courseJson from '../../course.json'

export interface CourseConfig {
  course: {
    name: string
    icon: string
    subtitle: string
    color: string
  }
  schedule: {
    weeks: number
    weekLabels: string[]
    weekTitles: string[]
  }
  lessons: LessonMeta[]
  features: {
    katex: boolean
    formulaNormalize: boolean
  }
  paths: {
    contentDir: string
    outputDir: string
  }
}

export interface LessonMeta {
  id: number
  title: string
  unit: string
  week: number
  day: number
  file: string
}

const config = courseJson as CourseConfig
export default config
