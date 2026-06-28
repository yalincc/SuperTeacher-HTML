import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getHomeDisplayItems, type HomeDisplayItem } from '@/data'
import { setHomeItemOrder } from '@/utils/storage'

function getItemId(item: HomeDisplayItem): string {
  return item.kind === 'course' ? item.course.id : item.group.id
}

function HomePage() {
  const [items, setItems] = useState(() => getHomeDisplayItems())
  const [editMode, setEditMode] = useState(false)

  const move = (index: number, dir: -1 | 1) => {
    const next = index + dir
    if (next < 0 || next >= items.length) return
    const updated = [...items]
    ;[updated[index], updated[next]] = [updated[next], updated[index]]
    setItems(updated)
    setHomeItemOrder(updated.map(getItemId))
  }

  return (
    <div>
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-[36px] font-bold text-text mb-2">SuperTeacher</h1>
        <p className="text-base text-text-secondary">互动学习平台</p>
        <button
          onClick={() => setEditMode(!editMode)}
          className="mt-3 text-sm text-text-muted hover:text-text transition-colors"
        >
          {editMode ? '✓ 完成' : '⚙ 调整顺序'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item, i) => {
          if (item.kind === 'course') {
            const c = item.course
            return (
              <div key={c.id} className="relative group bg-surface rounded-2xl border border-border p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                {editMode && (
                  <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
                    <button
                      onClick={(e) => { e.preventDefault(); move(i, -1) }}
                      disabled={i === 0}
                      className="w-7 h-7 rounded-lg bg-bg border border-border text-xs text-text-muted hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                    >↑</button>
                    <button
                      onClick={(e) => { e.preventDefault(); move(i, 1) }}
                      disabled={i === items.length - 1}
                      className="w-7 h-7 rounded-lg bg-bg border border-border text-xs text-text-muted hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                    >↓</button>
                  </div>
                )}
                <Link to={`/course/${c.id}`} className="block">
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
              </div>
            )
          }

          const g = item.group
          const totalLessons = g.courses.reduce((sum, c) => sum + c.lessonData.length, 0)
          return (
            <div key={g.id} className="relative group bg-surface rounded-2xl border border-border p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              {editMode && (
                <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
                  <button
                    onClick={(e) => { e.preventDefault(); move(i, -1) }}
                    disabled={i === 0}
                    className="w-7 h-7 rounded-lg bg-bg border border-border text-xs text-text-muted hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                  >↑</button>
                  <button
                    onClick={(e) => { e.preventDefault(); move(i, 1) }}
                    disabled={i === items.length - 1}
                    className="w-7 h-7 rounded-lg bg-bg border border-border text-xs text-text-muted hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                  >↓</button>
                </div>
              )}
              <Link to={`/course/${g.id}`} className="block">
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
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default HomePage
