import { Link } from 'react-router-dom'
import { courses } from '@/data'

function HomePage() {
  return (
    <div>
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-[36px] font-bold text-text mb-2">SuperTeacher</h1>
        <p className="text-base text-text-secondary">互动学习平台</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((c) => (
          <Link
            key={c.id}
            to={`/course/${c.id}`}
            className="group bg-surface rounded-2xl border border-border p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
          >
            <div className="text-4xl mb-3">{c.course.icon}</div>
            <h2 className="text-xl font-bold text-text mb-1">{c.course.name}</h2>
            <p className="text-sm text-text-secondary mb-4">{c.course.subtitle}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">{c.lessonData.length} 课时</span>
              <span
                className="text-sm font-medium transition-colors"
                style={{ color: c.course.color }}
              >
                开始学习 →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default HomePage
