import { Link } from 'react-router-dom'
import { getHomeDisplayItems } from '@/data'

function HomePage() {
  const items = getHomeDisplayItems()

  return (
    <div>
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-[36px] font-bold text-text mb-2">SuperTeacher</h1>
        <p className="text-base text-text-secondary">互动学习平台</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => {
          if (item.kind === 'course') {
            const c = item.course
            return (
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
                  <span className="text-sm font-medium transition-colors" style={{ color: c.course.color }}>
                    开始学习 →
                  </span>
                </div>
              </Link>
            )
          }

          const g = item.group
          const totalLessons = g.courses.reduce((sum, c) => sum + c.lessonData.length, 0)
          return (
            <Link
              key={g.id}
              to={`/course/${g.id}`}
              className="group bg-surface rounded-2xl border border-border p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="text-4xl mb-3">{g.icon}</div>
              <h2 className="text-xl font-bold text-text mb-1">{g.name}</h2>
              <p className="text-sm text-text-secondary mb-4">{g.courses.length} 个学期</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">{totalLessons} 课时</span>
                <span className="text-sm font-medium transition-colors" style={{ color: g.color }}>
                  选择学期 →
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default HomePage
