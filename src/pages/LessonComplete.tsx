import { useParams, Link } from 'react-router-dom'
import { getNextCourseInGroup, getCourseById } from '@/data'
import { BookOpen, ChevronRight, GraduationCap } from 'lucide-react'

function LessonComplete() {
  const { courseId } = useParams<{ courseId: string }>()
  const course = getCourseById(courseId || '')
  const nextCourse = getNextCourseInGroup(courseId || '')

  if (!course) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Link to="/" className="text-primary hover:underline">返回首页</Link>
      </div>
    )
  }

  const totalLessons = course.lessonData.length

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-sm">
        <div className="text-5xl mb-6">🎉</div>
        <h1 className="text-2xl font-bold text-text mb-2">本学期课时已完结</h1>
        <p className="text-sm text-text-secondary mb-8">
          你已完成「{course.course.name}」全部 {totalLessons} 课
        </p>

        <div className="flex flex-col gap-3">
          <Link
            to={`/course/${courseId}`}
            className="flex items-center justify-center gap-2 py-3.5 bg-surface border border-border rounded-full text-text font-medium hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <BookOpen className="w-4 h-4" />
            返回课程首页
          </Link>

          {nextCourse && (
            <Link
              to={`/course/${nextCourse.id}`}
              className="flex items-center justify-center gap-2 py-3.5 bg-primary text-white rounded-full font-medium hover:bg-primary-dark hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <GraduationCap className="w-4 h-4" />
              进入{nextCourse.course.name}
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default LessonComplete
