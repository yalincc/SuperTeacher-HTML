import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import courseConfig from '@/config/course'
import { useProgressContext } from '@/hooks/ProgressContext'

function HomePage() {
  const { course, schedule, lessons } = courseConfig
  const { isLessonCompleted, stats } = useProgressContext()

  return (
    <div>
      {/* Course header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          <span className="text-4xl mr-2">{course.icon}</span>
          {course.name}
        </h1>
        <p className="text-gray-500">{course.subtitle}</p>

        {/* Stats bar */}
        {stats.totalAttempted > 0 && (
          <div className="flex items-center justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-1.5 text-gray-600">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              已做 <strong>{stats.totalAttempted}</strong> 题
            </div>
            <div className="flex items-center gap-1.5 text-gray-600">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              正确 <strong>{stats.totalCorrect}</strong> 题
            </div>
            {stats.totalCompleted > 0 && (
              <div className="flex items-center gap-1.5 text-gray-600">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                完成 <strong>{stats.totalCompleted}</strong> 课
              </div>
            )}
          </div>
        )}
      </div>

      {/* Week sections */}
      {Array.from({ length: schedule.weeks }, (_, w) => (
        <section key={w} className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            {schedule.weekLabels[w]}：{schedule.weekTitles[w]}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {lessons
              .filter((l) => l.week === w + 1)
              .map((lesson) => {
                const completed = isLessonCompleted(lesson.id)
                return (
                  <Link
                    key={lesson.id}
                    to={`/lesson/${lesson.id}`}
                    className={`relative bg-white rounded-lg shadow-sm border p-4 hover:shadow-md hover:border-blue-300 transition ${
                      completed ? 'border-green-300 bg-green-50/50' : 'border-gray-200'
                    }`}
                  >
                    {completed && (
                      <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-green-500" />
                    )}
                    <div className="text-sm text-gray-400 mb-1">第{lesson.id}课</div>
                    <div className="font-medium text-gray-900 text-sm leading-snug">
                      {lesson.title}
                    </div>
                    <div className="text-xs text-gray-400 mt-2">{lesson.unit}</div>
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
