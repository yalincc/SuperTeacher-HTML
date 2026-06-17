import { useParams, Link } from 'react-router-dom'
import { getLessonById } from '@/data'
import { useProgressContext } from '@/hooks/ProgressContext'
import SectionObjectives from '@/components/knowledge/SectionObjectives'
import SectionKnowledge from '@/components/knowledge/SectionKnowledge'
import SectionExamples from '@/components/knowledge/SectionExamples'
import SectionSummary from '@/components/knowledge/SectionSummary'
import { Gamepad2, ChevronLeft, ChevronRight, Zap, Target, Layers, Lightbulb, ListChecks } from 'lucide-react'
import { useState } from 'react'

type TabKey = 'objectives' | 'knowledge' | 'examples' | 'summary'

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'objectives', label: '目标', icon: <Target className="w-4 h-4" /> },
  { key: 'knowledge', label: '知识', icon: <Layers className="w-4 h-4" /> },
  { key: 'examples', label: '例题', icon: <Lightbulb className="w-4 h-4" /> },
  { key: 'summary', label: '小结', icon: <ListChecks className="w-4 h-4" /> },
]

function LessonPage() {
  const { id } = useParams<{ id: string }>()
  const lessonId = Number(id)
  const lesson = getLessonById(lessonId)
  const { getExerciseResults } = useProgressContext()
  const [activeTab, setActiveTab] = useState<TabKey>('objectives')

  // 游戏成绩
  const gameResults = lesson ? getExerciseResults(lessonId) : undefined
  const gameExercises = lesson?.exercises.filter((e) => e.type === 'choice' || e.type === 'true_false') ?? []
  const gameAnswered = gameExercises.filter((e) => gameResults?.[e.id]?.answered).length
  const gameCorrect = gameExercises.filter((e) => gameResults?.[e.id]?.answered && gameResults[e.id].correct).length
  const hasGameRecord = gameAnswered > 0

  if (!lesson) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted mb-3">课时不存在</p>
          <Link to="/" className="text-primary hover:underline">返回首页</Link>
        </div>
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'objectives':
        return <SectionObjectives objectives={lesson.objectives} />
      case 'knowledge':
        return <SectionKnowledge sections={lesson.knowledge} />
      case 'examples':
        return <SectionExamples examples={lesson.examples} />
      case 'summary':
        return <SectionSummary summary={lesson.summary} />
    }
  }

  return (
    <div className="pb-24">
      {/* ── Hero 头部 — Apple 简约风 ── */}
      <div className="pt-4 pb-6">
        {/* 课时标签 + 导航 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
              第 {lesson.meta.id} 课
            </span>
            <span className="text-xs text-text-muted">{lesson.meta.unit}</span>
          </div>

          <div className="flex items-center gap-1">
            {lesson.meta.id > 1 && (
              <Link
                to={`/lesson/${lesson.meta.id - 1}`}
                className="flex items-center gap-0.5 px-2.5 py-1.5 text-xs text-text-secondary hover:text-primary hover:bg-primary-bg rounded-lg transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                上一课
              </Link>
            )}
            <Link
              to={`/lesson/${lesson.meta.id + 1}`}
              className="flex items-center gap-0.5 px-2.5 py-1.5 text-xs text-text-secondary hover:text-primary hover:bg-primary-bg rounded-lg transition"
            >
              下一课
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 大标题 */}
        <h1 className="text-3xl sm:text-4xl font-bold text-text leading-tight tracking-tight">
          {lesson.meta.title}
        </h1>

        {/* 副标题 / 游戏状态 */}
        <p className="mt-2 text-sm text-text-secondary">
          {hasGameRecord ? (
            <>
              已挑战：<span className="text-success font-semibold">{gameCorrect}/{gameExercises.length}</span> 正确
              {' · '}
              <Link to={`/lesson/${lessonId}/game`} className="text-primary hover:underline font-medium">
                再战一次 →
              </Link>
            </>
          ) : (
            <>{lesson.objectives.filter((o) => o.isKeyPoint).length} 个重点目标 · {lesson.knowledge.length} 个知识模块</>
          )}
        </p>
      </div>

      {/* ── Tab 栏 ── */}
      <div className="sticky top-14 z-20 -mx-4 px-4 py-2 bg-bg/90 backdrop-blur-md border-b border-border/60">
        <div className="flex items-center gap-1 bg-bg border border-border rounded-full p-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-secondary hover:text-text hover:bg-surface'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab 内容区 ── */}
      <div key={activeTab} className="mt-6 animate-[tab-fade-in_0.25s_ease-out]">
        {renderTabContent()}
      </div>

      {/* ── Sticky CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-bg/90 backdrop-blur-md border-t border-border/60">
        <div className="max-w-[900px] mx-auto px-4 py-3">
          <Link
            to={`/lesson/${lessonId}/game`}
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary text-white rounded-full font-semibold text-base hover:bg-primary-dark active:scale-[0.98] transition-all shadow-md"
          >
            <Gamepad2 className="w-5 h-5" />
            开始挑战
            <Zap className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LessonPage
