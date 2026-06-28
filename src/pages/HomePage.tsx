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
          className={`mt-3 text-sm px-3 py-1.5 rounded-lg transition-all ${
            editMode
              ? 'bg-success text-white'
              : 'text-text-muted hover:text-text hover:bg-surface border border-border'
          }`}
        >
          {editMode ? '✓ 完成' : '⚙ 调整顺序'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item, i) => {
          if (item.kind === 'course') {
            const c = item.course
            return (
              <div
                key={c.id}
                className={`relative bg-surface rounded-2xl border p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
                  editMode ? 'border-primary/40' : 'border-border'
                }`}
              >
                {editMode && (
                  <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
                    <button
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      className="w-7 h-7 rounded-lg bg-bg border border-border text-xs text-text-muted hover:bg-primary/10 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                    >↑</button>
                    <button
                      onClick={() => move(i, 1)}
                      disabled={i === items.length - 1}
                      className="w-7 h-7 rounded-lg bg-bg border border-border text-xs text-text-muted hover:bg-primary/10 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                    >↓</button>
                  </div>
                )}
                <Link
                  to={editMode ? '#' : `/course/${c.id}`}
                  className={`block ${editMode ? 'pointer-events-none' : ''}`}
                  onClick={(e) => { if (editMode) e.preventDefault() }}
                >
                  <div className="text-4xl mb-3">{c.course.icon}</div>
                  <h2 className="text-xl font-bold text-text mb-1">{c.course.name}</h2>
                  <p className="text-sm text-text-secondary mb-4">{c.course.subtitle}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-muted">{c.lessonData.length} 课时</span>
                    <span className="text-sm font-medium transition-colors" style={{ color: c.course.color }}>
                      {c.course.unit ? `选择${c.course.unit} →` : '开始学习 →'}
                    </span>
                  </div>
                </Link>
              </div>
            )
          }

          const g = item.group
          const totalLessons = g.courses.reduce((sum, c) => sum + c.lessonData.length, 0)
          return (
            <div
              key={g.id}
              className={`relative bg-surface rounded-2xl border p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
                editMode ? 'border-primary/40' : 'border-border'
              }`}
            >
              {editMode && (
                <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
                  <button
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="w-7 h-7 rounded-lg bg-bg border border-border text-xs text-text-muted hover:bg-primary/10 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                  >↑</button>
                  <button
                    onClick={() => move(i, 1)}
                    disabled={i === items.length - 1}
                    className="w-7 h-7 rounded-lg bg-bg border border-border text-xs text-text-muted hover:bg-primary/10 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                  >↓</button>
                </div>
              )}
              <Link
                to={editMode ? '#' : `/course/${g.id}`}
                className={`block ${editMode ? 'pointer-events-none' : ''}`}
                onClick={(e) => { if (editMode) e.preventDefault() }}
              >
                <div className="text-4xl mb-3">{g.icon}</div>
                <h2 className="text-xl font-bold text-text mb-1">{g.name}</h2>
                <p className="text-sm text-text-secondary mb-4">{g.subtitle || `${g.courses.length} 个${g.unit || '学期'}`}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">{totalLessons} 课时</span>
                  <span className="text-sm font-medium transition-colors" style={{ color: g.color }}>
                    选择{g.unit || '学期'} →
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
