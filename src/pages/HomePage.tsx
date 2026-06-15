import { Link } from 'react-router-dom'
import courseConfig from '@/config/course'
import { useProgressContext } from '@/hooks/ProgressContext'
import { useGameContext } from '@/hooks/useGame'
import { Lock } from 'lucide-react'

function HomePage() {
  const { course, schedule, lessons } = courseConfig
  const { isLessonCompleted, stats } = useProgressContext()
  const { isLessonUnlocked } = useGameContext()

  return (
    <div>
      {/* Course header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl sm:text-[28px] font-bold text-text mb-2">
          <span className="text-[32px] mr-2">{course.icon}</span>
          {course.name}
        </h1>
        <p className="text-sm sm:text-base text-text-secondary">{course.subtitle}</p>

        {/* Stats bar */}
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

      {/* Week sections */}
      {Array.from({ length: schedule.weeks }, (_, w) => (
        <section key={w} className="mb-8">
          <h2 className="text-[17px] font-semibold text-text mb-3">
            {schedule.weekLabels[w]}：{schedule.weekTitles[w]}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {lessons
              .filter((l) => l.week === w + 1)
              .map((lesson) => {
                const completed = isLessonCompleted(lesson.id)
                const unlocked = isLessonUnlocked(lesson.id)
                return (
                  <Link
                    key={lesson.id}
                    to={unlocked ? `/lesson/${lesson.id}` : '#'}
                    className={`relative bg-surface rounded-r-[10px] border border-border border-l-[3px] border-l-primary p-3.5 pl-4 transition-all duration-200 ${
                      unlocked
                        ? 'hover:shadow-md hover:-translate-y-0.5'
                        : 'opacity-60 cursor-not-allowed'
                    } ${completed ? 'bg-primary-bg border-border/60' : ''}`}
                    onClick={(e) => {
                      if (!unlocked) e.preventDefault()
                    }}
                  >
                    {!unlocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 rounded-r-[10px]">
                        <Lock className="w-6 h-6 text-gray-300" />
                      </div>
                    )}
                    {completed && unlocked && (
                      <div className="absolute top-2.5 right-2.5 w-[18px] h-[18px] bg-success rounded-full flex items-center justify-center">
                        <span className="text-white text-[11px] leading-none">✓</span>
                      </div>
                    )}
                    <div className="text-xs text-text-muted mb-1">第{lesson.id}课</div>
                    <div className="font-medium text-text text-sm leading-snug">
                      {lesson.title}
                    </div>
                    <div className="text-xs text-text-muted mt-2">{lesson.unit}</div>
                    {/* 底部进度条 */}
                    <div className="h-[3px] bg-border rounded-b-[10px] mt-3 -mx-3.5 -mb-3.5 overflow-hidden">
                      <div
                        className="h-full bg-success rounded-b-[10px] transition-all duration-400"
                        style={{ width: completed ? '100%' : '0%' }}
                      />
                    </div>
                  </Link>
                )
              })}
          </div>
        </section>
      ))}
    </div>
  )
}

export default HomePage
