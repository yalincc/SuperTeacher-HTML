import { useParams, Link } from 'react-router-dom'
import { getLessonById } from '@/data'
import { useProgressContext } from '@/hooks/ProgressContext'
import SectionObjectives from '@/components/knowledge/SectionObjectives'
import SectionKnowledge from '@/components/knowledge/SectionKnowledge'
import SectionExamples from '@/components/knowledge/SectionExamples'
import SectionExercises from '@/components/exercises/SectionExercises'
import SectionSummary from '@/components/knowledge/SectionSummary'
import type { ExerciseResult } from '@/types'

function LessonPage() {
  const { id } = useParams<{ id: string }>()
  const lessonId = Number(id)
  const lesson = getLessonById(lessonId)
  const { answerExercise, getExerciseResults } = useProgressContext()

  const savedResults = lesson ? getExerciseResults(lessonId) : undefined

  if (!lesson) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">课时不存在</p>
        <Link to="/" className="text-blue-600 hover:underline mt-2 inline-block">
          返回首页
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Top navigation */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        {lesson.meta.id > 1 ? (
          <Link to={`/lesson/${lesson.meta.id - 1}`} className="text-sm text-blue-600 hover:underline">
            ← 上一课
          </Link>
        ) : (
          <Link to="/" className="text-sm text-blue-600 hover:underline">
            ← 首页
          </Link>
        )}
        <h1 className="text-xl font-bold text-gray-900 text-center">
          第{lesson.meta.id}课：{lesson.meta.title}
        </h1>
        <Link to={`/lesson/${lesson.meta.id + 1}`} className="text-sm text-blue-600 hover:underline">
          下一课 →
        </Link>
      </div>

      {/* 一、学习目标 */}
      <SectionObjectives objectives={lesson.objectives} />

      {/* 二、知识点梳理 */}
      <SectionKnowledge sections={lesson.knowledge} />

      {/* 三、典型例题 */}
      <SectionExamples examples={lesson.examples} />

      {/* 四、课后练习 */}
      <SectionExercises
        exercises={lesson.exercises}
        savedResults={savedResults}
        onAnswer={(exerciseId: string, result: ExerciseResult) => {
          answerExercise(lessonId, exerciseId, result)
        }}
      />

      {/* 五、本课小结 */}
      <SectionSummary summary={lesson.summary} />
    </div>
  )
}

export default LessonPage
