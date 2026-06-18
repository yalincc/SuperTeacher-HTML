import { Outlet, Link, useParams } from 'react-router-dom'
import { Home } from 'lucide-react'
import { getCourseById } from '@/data'

function AppLayout() {
  const { courseId } = useParams<{ courseId: string }>()
  const course = courseId ? getCourseById(courseId) : null

  return (
    <div className="min-h-screen bg-bg">
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-[900px] mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-text hover:text-primary transition">
            <span className="text-xl">📚</span>
            <span className="font-bold">SuperTeacher</span>
          </Link>
          <nav className="flex items-center gap-4">
            {course && (
              <Link
                to={`/course/${courseId}`}
                className="flex items-center gap-1 text-sm text-text-secondary hover:text-primary transition"
              >
                <span>{course.course.icon}</span>
                <span className="hidden sm:inline">{course.course.name}</span>
              </Link>
            )}
            <Link to="/" className="flex items-center gap-1 text-sm text-text-secondary hover:text-primary transition">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">首页</span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-[900px] mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
