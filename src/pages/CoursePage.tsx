import { Link, useParams } from 'react-router-dom'
import { getCourseById } from '@/data'
import { useProgressContext } from '@/hooks/ProgressContext'

function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>()
  const course = getCourseById(courseId || '')
  const { isLessonCompleted, stats } = useProgressContext()

  if (!course) {
    return <div className="text-center py-12 text-text-secondary">课程不存在</div>
  }

  const { course: info, lessonData } = course

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-2xl sm:text-[28px] font-bold text-text mb-2">
          <span className="text-[32px] mr-2">{info.icon}</span>
          {info.name}
        </h1>
        <p className="text-sm sm:text-base text-text-secondary">{info.subtitle}</p>

        {stats.totalAttempted > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4 text-sm">
            <div className="flex items-center gap-1.5 text-text-secondary">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              已做 <strong>{stats.totalAttempted}</strong> 题
            </div>
            <div className="flex items-center gap-1.5 text-text-secondary">
              <span className="w-2 h-2 rounded-full bg-success" />
              正确 <strong>{stats.totalCorrect}</strong> 题
            </div>
            {stats.totalCompleted > 0 && (
              <div className="flex items-center gap-1.5 text-text-secondary">
                <span className="w-2 h-2 rounded-full bg-warning" />
                完成 <strong>{stats.totalCompleted}</strong> 课
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {lessonData.map((lesson) => {
          const lid = lesson.meta.id
          const completed = isLessonCompleted(lid)
          return (
            <Link
              key={lid}
              to={`/course/${courseId}/lesson/${lid}`}
              className={`flex items-center gap-4 bg-surface rounded-xl border border-border p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
                completed ? 'bg-primary-bg border-border/60' : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                completed ? 'bg-success text-white' : 'bg-primary/10 text-primary'
              }`}>
                {completed ? '✓' : lid}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-text text-sm leading-snug">
                  {lesson.meta.title}
                </div>
                <div className="text-xs text-text-muted mt-0.5">{lesson.meta.unit}</div>
              </div>
              <div className="text-xs text-text-muted">
                {lesson.objectives.length} 个目标
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default CoursePage
