import { Outlet, Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import courseConfig from '@/config/course'

function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* TopNav */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-900 hover:text-blue-600 transition">
            <span className="text-xl">{courseConfig.course.icon}</span>
            <span className="font-bold">{courseConfig.course.name}</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">首页</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
