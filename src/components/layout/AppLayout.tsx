import { Outlet, Link, useParams } from 'react-router-dom'
import { Home } from 'lucide-react'
import { getCourseById, getGroupById, isGroupId } from '@/data'

function AppLayout() {
  const { courseId } = useParams<{ courseId: string }>()
  const course = courseId ? getCourseById(courseId) : null

  // 导航面包屑：分组课程显示分组信息，独立课程显示课程信息
  let navInfo: { icon: string; name: string; to: string } | null = null
  if (courseId) {
    if (isGroupId(courseId)) {
      const group = getGroupById(courseId)
      if (group) navInfo = { icon: group.icon, name: group.name, to: `/course/${courseId}` }
    } else if (course?.group) {
      navInfo = { icon: course.group.icon, name: course.group.name, to: `/course/${course.group.id}` }
    } else if (course) {
      navInfo = { icon: course.course.icon, name: course.course.name, to: `/course/${courseId}` }
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-[900px] mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-text hover:text-primary transition">
            <span className="text-xl">📚</span>
            <span className="font-bold">SuperTeacher</span>
          </Link>
          <nav className="flex items-center gap-4">
            {navInfo && (
              <Link
                to={navInfo.to}
                className="flex items-center gap-1 text-sm text-text-secondary hover:text-primary transition"
              >
                <span>{navInfo.icon}</span>
                <span className="hidden sm:inline">{navInfo.name}</span>
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
