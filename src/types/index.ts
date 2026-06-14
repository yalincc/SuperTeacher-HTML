// ===== 课程元数据 =====
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

// ===== 课时数据 =====
export interface LessonData {
  meta: {
    id: number
    slug: string
    title: string
    unit: string
    week: number
    day: number
  }
  objectives: Objective[]
  knowledge: KnowledgeSection[]
  examples: Example[]
  exercises: Exercise[]
  summary: SummaryNode[]
}

// ===== 学习目标 =====
export interface Objective {
  text: string
  isKeyPoint: boolean
}

// ===== 知识点分区 =====
export interface KnowledgeSection {
  title: string
  defaultExpanded: boolean
  blocks: ContentBlock[]
}

// ===== 内容块（最核心抽象） =====
export type ContentBlock =
  | ParagraphBlock
  | TableBlock
  | CalloutBlock
  | EquationBlock
  | ListBlock

export interface ParagraphBlock {
  type: 'paragraph'
  content: string
}

export interface TableBlock {
  type: 'table'
  headers: string[]
  rows: string[][]
}

export interface CalloutBlock {
  type: 'callout'
  variant: 'warning' | 'tip' | 'note' | 'mnemonic'
  title: string
  content: string
}

export interface EquationBlock {
  type: 'equation'
  latex: string
  display: boolean
}

export interface ListBlock {
  type: 'list'
  ordered: boolean
  items: string[]
}

// ===== 典型例题 =====
export interface Example {
  title: string
  problem: ContentBlock[]
  solution: ContentBlock[]
  answer: string
  source?: string
}

// ===== 练习题 =====
export type Exercise =
  | ChoiceExercise
  | TrueFalseExercise
  | FillExercise
  | ShortAnswerExercise

export interface ChoiceExercise {
  type: 'choice'
  id: string
  stem: string
  options: { label: string; text: string }[]
  answer: string
  analysis: string
  source?: string
}

export interface TrueFalseExercise {
  type: 'true_false'
  id: string
  stem: string
  answer: boolean
  analysis: string
  source?: string
}

export interface FillExercise {
  type: 'fill'
  id: string
  segments: string[]
  blanks: FillBlank[]
  analysis: string
  source?: string
}

export interface FillBlank {
  index: number
  answer: string
  alternatives?: string[]
}

export interface ShortAnswerExercise {
  type: 'short_answer'
  id: string
  question: string
  referenceAnswer: string
  scoringPoints?: string[]
}

// ===== 本课小结 =====
export interface SummaryNode {
  text: string
  children?: SummaryNode[]
}

// ===== 学习进度 =====
export interface UserProgress {
  version: 1
  lessons: Record<string, LessonProgress>
  stats: ProgressStats
}

export interface LessonProgress {
  knowledgeRead: boolean
  exerciseResults: Record<string, ExerciseResult>
  completedAt?: number
}

export interface ExerciseResult {
  answered: boolean
  correct: boolean
  userAnswer: string
  timestamp: number
}

export interface ProgressStats {
  totalCompleted: number
  totalCorrect: number
  totalAttempted: number
  wrongExercises: WrongExercise[]
}

export interface WrongExercise {
  lessonId: number
  exerciseId: string
  userAnswer: string
  timestamp: number
}
