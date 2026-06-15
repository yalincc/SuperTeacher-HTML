import { useParams, Link } from 'react-router-dom'
import { getLessonById } from '@/data'
import { useProgressContext } from '@/hooks/ProgressContext'
import { useGameContext } from '@/hooks/useGame'
import SectionObjectives from '@/components/knowledge/SectionObjectives'
import SectionKnowledge from '@/components/knowledge/SectionKnowledge'
import SectionExamples from '@/components/knowledge/SectionExamples'
import SectionExercises from '@/components/exercises/SectionExercises'
import SectionSummary from '@/components/knowledge/SectionSummary'
import type { ExerciseResult } from '@/types'
import { Lock } from 'lucide-react'

function LessonPage() {
  const { id } = useParams<{ id: string }>()
  const lessonId = Number(id)
  const lesson = getLessonById(lessonId)
  const { answerExercise, getExerciseResults } = useProgressContext()
  const { hearts, resetHearts, useHeart, isModuleUnlocked, completeModule, unlockNextModule } = useGameContext()

  const savedResults = lesson ? getExerciseResults(lessonId) : undefined
  const exercisesCompleted = isModuleUnlocked(lessonId, 'exercises')

  if (!lesson) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">课时不存在</p>
        <Link to="/" className="text-blue-600 hover:underline mt-2 inline-block">
          返回首页
        </Link>
      </div>
    )
  }

  function handleExercisesComplete() {
    completeModule(lessonId, 'exercises')
    unlockNextModule(lessonId, 'exercises')
  }

  function handleResetExercises() {
    // Reset exercise results for this lesson
    const emptyResults: Record<string, ExerciseResult> = {}
    lesson.exercises.forEach((ex) => {
      answerExercise(lessonId, ex.id, {
        answered: false,
        correct: false,
        userAnswer: '',
        timestamp: 0,
      })
    })
  }

  return (
    <div>
      {/* Top navigation */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        {/* Mobile: stacked layout */}
        <div className="sm:hidden">
          <div className="flex items-center justify-between mb-2">
            {lesson.meta.id > 1 ? (
              <Link to={`/lesson/${lesson.meta.id - 1}`} className="text-sm text-blue-600 hover:underline">
                ← 上一课
              </Link>
            ) : (
              <Link to="/" className="text-sm text-blue-600 hover:underline">
                ← 首页
              </Link>
            )}
            <Link to={`/lesson/${lesson.meta.id + 1}`} className="text-sm text-blue-600 hover:underline">
              下一课 →
            </Link>
          </div>
          <h1 className="text-lg font-bold text-gray-900">
            第{lesson.meta.id}课：{lesson.meta.title}
          </h1>
        </div>
        {/* Desktop: inline layout */}
        <div className="hidden sm:flex items-center justify-between">
          {lesson.meta.id > 1 ? (
            <Link to={`/lesson/${lesson.meta.id - 1}`} className="text-sm text-blue-600 hover:underline">
              ← 上一课
            </Link>
          ) : (
            <Link to="/" className="text-sm text-blue-600 hover:underline">
              ← 首页
            </Link>
          )}
          <h1 className="text-xl font-bold text-gray-900 text-center">
            第{lesson.meta.id}课：{lesson.meta.title}
          </h1>
          <Link to={`/lesson/${lesson.meta.id + 1}`} className="text-sm text-blue-600 hover:underline">
            下一课 →
          </Link>
        </div>
      </div>

      {/* Hearts display */}
      <div className="flex items-center justify-end gap-1 mb-4">
        {Array.from({ length: 3 }, (_, i) => (
          <span
            key={i}
            className={`text-xl transition-all duration-300 ${
              i < hearts ? 'text-red-500 scale-100' : 'text-gray-200 scale-75'
            }`}
          >
            ❤️
          </span>
        ))}
        {hearts === 0 && (
          <div className="flex items-center gap-2 ml-2">
            <span className="text-xs text-red-500 font-medium">生命值耗尽</span>
            <button
              onClick={resetHearts}
              className="px-3 py-1 bg-red-500 text-white text-xs rounded-full hover:bg-red-600 transition"
            >
              重新开始
            </button>
          </div>
        )}
      </div>

      {/* Game over overlay */}
      {hearts === 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4 shadow-xl">
            <div className="text-5xl mb-4">💔</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">生命值耗尽</h3>
            <p className="text-sm text-gray-500 mb-6">别灰心，再来一次吧！</p>
            <button
              onClick={resetHearts}
              className="px-6 py-2.5 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition"
            >
              重新开始
            </button>
          </div>
        </div>
      )}

      {/* 一、学习目标 — 直接显示 */}
      <SectionObjectives objectives={lesson.objectives} />

      {/* 二、知识点梳理 — 直接显示 */}
      <SectionKnowledge sections={lesson.knowledge} />

      {/* 三、典型例题 — 直接显示 */}
      <SectionExamples examples={lesson.examples} />

      {/* 四、课后练习 — 游戏区域 */}
      <div className="my-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">四</span>
            课后练习
          </h2>
          {exercisesCompleted && (
            <button
              onClick={handleResetExercises}
              className="px-3 py-1.5 text-xs text-primary border border-primary rounded-full hover:bg-primary-bg transition"
            >
              🔄 重做题目
            </button>
          )}
        </div>
        <SectionExercises
          exercises={lesson.exercises}
          savedResults={savedResults}
          onAnswer={(exerciseId: string, result: ExerciseResult) => {
            answerExercise(lessonId, exerciseId, result)
          }}
          onComplete={handleExercisesComplete}
          onWrongAnswer={useHeart}
        />
      </div>

      {/* 五、本课小结 — 练习完成后显示 */}
      {exercisesCompleted ? (
        <SectionSummary summary={lesson.summary} />
      ) : (
        <div className="my-8 p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-center">
          <Lock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400">完成课后练习后解锁本课小结</p>
        </div>
      )}
    </div>
  )
}

export default LessonPage
