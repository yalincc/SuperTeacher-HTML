import { Link, useParams } from 'react-router-dom'
import { getGroupById } from '@/data'

function SemesterPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const group = getGroupById(courseId || '')

  if (!group) {
    return <div className="text-center py-12 text-text-secondary">课程不存在</div>
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-2xl sm:text-[28px] font-bold text-text mb-2">
          <span className="text-[32px] mr-2">{group.icon}</span>
          {group.name}
        </h1>
        <p className="text-sm sm:text-base text-text-secondary">选择学期开始学习</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {group.courses.map((c) => {
          const lessonCount = c.lessonData.length
          return (
            <Link
              key={c.id}
              to={`/course/${c.id}`}
              className="group bg-surface rounded-2xl border border-border p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="text-3xl mb-3">{c.course.icon}</div>
              <h2 className="text-lg font-bold text-text mb-1">
                {c.semester?.name ?? c.course.name}
              </h2>
              <p className="text-sm text-text-secondary mb-4">{c.course.subtitle}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">
                  {lessonCount > 0 ? `${lessonCount} 课时` : '即将上线'}
                </span>
                <span
                  className="text-sm font-medium transition-colors"
                  style={{ color: group.color }}
                >
                  {lessonCount > 0 ? '开始学习 →' : '敬请期待'}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default SemesterPage
