import { useParams, Link, useNavigate } from 'react-router-dom'
import { getLessonById } from '@/data'
import { useProgressContext } from '@/hooks/ProgressContext'
import { useGameContext } from '@/hooks/useGame'
import { useState, useMemo, useEffect } from 'react'
import type { ExerciseResult, Exercise } from '@/types'
import { RotateCcw, ChevronRight, X } from 'lucide-react'
import ChoiceExerciseComp from '@/components/exercises/types/ChoiceExercise'
import TrueFalseExerciseComp from '@/components/exercises/types/TrueFalseExercise'

/** 游戏模式只接受的题型 */
const GAME_TYPES = new Set(['choice', 'true_false'])

// ─── Confetti ────────────────────────────────────────────────────────────────
const CONFETTI_COLORS = ['#e8600c', '#f97316', '#0d9488', '#d97706', '#3b82f6', '#ec4899', '#8b5cf6']

function Confetti() {
  const particles = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        duration: 1.8 + Math.random() * 1.2,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: 6 + Math.random() * 8,
        rotate: Math.random() * 360,
      })),
    [],
  )
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-sm animate-[confettiFall_linear_forwards]"
          style={{
            left: `${p.left}%`,
            top: '-20px',
            width: p.size,
            height: p.size * 0.5,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  )
}

// ─── Stars ───────────────────────────────────────────────────────────────────
function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center justify-center gap-3">
      {[0, 1, 2].map((i) => {
        const filled = i < count
        return (
          <span
            key={i}
            className={`text-5xl ${filled ? 'animate-[starPop_0.5s_ease-out_both]' : ''}`}
            style={{ animationDelay: `${i * 0.25}s`, filter: filled ? 'none' : 'grayscale(1)', opacity: filled ? undefined : 0.2 }}
          >
            ⭐
          </span>
        )
      })}
    </div>
  )
}

// ─── Main ────────────────────────────────────────────────────────────────────
function GamePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const lessonId = Number(id)
  const lesson = getLessonById(lessonId)
  const { answerExercise, getExerciseResults } = useProgressContext()
  const { hearts, resetHearts, useHeart } = useGameContext()

  const savedResults = lesson ? getExerciseResults(lessonId) : undefined
  // 游戏模式只包含选择题和判断题
  const exercises = useMemo(
    () => (lesson?.exercises ?? []).filter((e) => GAME_TYPES.has(e.type)),
    [lesson],
  )

  const [current, setCurrent] = useState(0)
  const [answered, setAnswered] = useState(false) // 当前题是否已答
  const [animation, setAnimation] = useState<'correct' | 'wrong' | null>(null)
  const [showComplete, setShowComplete] = useState(false)
  const [heartShake, setHeartShake] = useState(false)

  // 本局统计（基于游戏题）
  const { correctCount, answeredCount } = useMemo(() => {
    let correct = 0, answered = 0
    for (const ex of exercises) {
      const r = savedResults?.[ex.id]
      if (r?.answered) { answered++; if (r.correct) correct++ }
    }
    return { correctCount: correct, answeredCount: answered }
  }, [exercises, savedResults])

  const totalCount = exercises.length
  const isGameOver = hearts === 0

  // 星级：全对3星，≥70% 2星，否则1星
  const starCount = totalCount > 0
    ? (correctCount === totalCount ? 3 : correctCount / totalCount >= 0.7 ? 2 : 1)
    : 0
  const isPerfect = starCount === 3

  // 切到新题目时重置 answered 状态
  useEffect(() => {
    setAnswered(false)
  }, [current])

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <p className="text-text-muted mb-2">课时不存在</p>
          <Link to="/" className="text-primary hover:underline">返回首页</Link>
        </div>
      </div>
    )
  }

  const ex = exercises[current]

  function handleAnswer(exerciseId: string, result: ExerciseResult) {
    answerExercise(lessonId, exerciseId, result)
    setAnswered(true)
    if (result.correct) {
      setAnimation('correct')
      setTimeout(() => setAnimation(null), 900)
    } else {
      setAnimation('wrong')
      setHeartShake(true)
      useHeart()
      setTimeout(() => {
        setAnimation(null)
        setHeartShake(false)
      }, 900)
    }
  }

  function handleNext() {
    if (current < totalCount - 1) {
      setCurrent((c) => c + 1)
    } else {
      setShowComplete(true)
    }
  }

  function handleReset() {
    exercises.forEach((e) =>
      answerExercise(lessonId, e.id, { answered: false, correct: false, userAnswer: '', timestamp: 0 }),
    )
    setCurrent(0)
    setAnswered(false)
    setAnimation(null)
    setShowComplete(false)
  }

  function handleResetAll() {
    resetHearts()
    handleReset()
  }

  function renderExercise(e: Exercise) {
    const saved = savedResults?.[e.id]
    const onAnswer = (r: ExerciseResult) => handleAnswer(e.id, r)
    switch (e.type) {
      case 'choice':     return <ChoiceExerciseComp    exercise={e} savedResult={saved} onAnswer={onAnswer} />
      case 'true_false': return <TrueFalseExerciseComp exercise={e} savedResult={saved} onAnswer={onAnswer} />
      default: return null
    }
  }

  const typeLabels: Record<string, string> = {
    choice: '选择题', true_false: '判断题',
  }

  const progress = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0

  return (
    <div className="fixed inset-0 z-40 bg-bg flex flex-col overflow-hidden">

      {/* ── Sticky Header ── */}
      <div className="sticky top-0 bg-surface/95 backdrop-blur-sm border-b border-border z-40">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* 返回 */}
            <Link to={`/lesson/${lessonId}`} className="text-text-muted hover:text-text transition">
              <X className="w-5 h-5" />
            </Link>

            {/* 心数 */}
            <div className={`flex items-center gap-0.5 ${heartShake ? 'animate-[shake_0.4s_ease-in-out]' : ''}`}>
              {Array.from({ length: 3 }, (_, i) => (
                <span
                  key={i}
                  className={`text-xl transition-all duration-300 ${
                    i < hearts ? 'scale-100' : 'scale-75 opacity-20 grayscale'
                  }`}
                >
                  ❤️
                </span>
              ))}
            </div>

            {/* 进度 */}
            <span className="text-xs font-medium text-text-muted">
              {current + 1} / {totalCount}
            </span>
          </div>

          {/* 进度条 */}
          <div className="mt-2 h-2 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Game Over Overlay ── */}
      {isGameOver && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-[fade-in_0.3s_ease-out]">
          <div className="bg-surface rounded-2xl p-8 text-center max-w-sm mx-4 shadow-xl animate-[cardEnter_0.4s_ease-out]">
            <div className="text-6xl mb-4 animate-[starPop_0.6s_ease-out]">💔</div>
            <h3 className="text-xl font-bold text-text mb-1">生命值耗尽</h3>
            <p className="text-sm text-text-muted mb-6">别灰心，再来一次吧！</p>
            <button
              onClick={handleResetAll}
              className="px-8 py-3 bg-primary text-white rounded-full font-bold text-base hover:bg-primary-dark transition shadow-md"
            >
              重新开始
            </button>
          </div>
        </div>
      )}

      {/* ── Completion Overlay ── */}
      {showComplete && (
        <>
          {isPerfect && <Confetti />}
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40 animate-[fade-in_0.3s_ease-out]">
            <div className="bg-surface rounded-3xl p-8 text-center max-w-sm mx-4 shadow-2xl animate-[cardEnter_0.5s_ease-out]">
              <div className="text-6xl mb-2">🎉</div>
              <h2 className="text-2xl font-bold text-text mb-1">挑战完成！</h2>
              <p className="text-sm text-text-muted mb-5">第 {lesson.meta.id} 课 · {lesson.meta.title}</p>

              <Stars count={starCount} />

              {/* 统计卡 */}
              <div className="mt-5 grid grid-cols-3 gap-2">
                <div className="py-2.5 bg-primary-bg rounded-xl">
                  <p className="text-xs text-text-muted">答题</p>
                  <p className="text-lg font-bold text-primary">{answeredCount}/{totalCount}</p>
                </div>
                <div className="py-2.5 bg-success-bg rounded-xl">
                  <p className="text-xs text-text-muted">正确率</p>
                  <p className="text-lg font-bold text-success">
                    {totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0}%
                  </p>
                </div>
                <div className="py-2.5 bg-surface-warm rounded-xl">
                  <p className="text-xs text-text-muted">评级</p>
                  <p className="text-lg font-bold text-warning">
                    {'⭐'.repeat(starCount)}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 border-2 border-primary text-primary rounded-full font-medium hover:bg-primary-bg transition flex items-center justify-center gap-1.5 text-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  再来一次
                </button>
                <button
                  onClick={() => navigate(`/lesson/${lessonId + 1}`)}
                  className="flex-1 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition flex items-center justify-center gap-1.5 text-sm shadow-md"
                >
                  下一课
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Correct Flash Overlay ── */}
      {animation === 'correct' && (
        <div className="fixed inset-0 bg-success/15 pointer-events-none z-30 animate-[flashFade_0.8s_ease-out_forwards]" />
      )}

      {/* ── Question Area（可滚动） ── */}
      <main className="flex-1 min-h-0 overflow-y-auto max-w-2xl w-full mx-auto px-4 pt-6 pb-4">
        {/* 题目卡 */}
        <div
          key={current}
          className={`bg-surface rounded-2xl border border-border shadow-sm animate-[cardEnter_0.35s_ease-out] ${
            animation === 'wrong' ? 'animate-[shake_0.4s_ease-in-out]' : ''
          }`}
        >
          {/* 题号条 */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-bg/60">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shadow-sm">
                {current + 1}
              </span>
              <span className="text-sm font-medium text-text-secondary">
                {typeLabels[ex.type] ?? ex.type}
              </span>
            </div>
            {savedResults?.[ex.id]?.answered && (
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  savedResults[ex.id].correct ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                }`}
              >
                {savedResults[ex.id].correct ? '✓ 正确' : '✗ 错误'}
              </span>
            )}
          </div>

          {/* 题目内容 */}
          <div className="p-5">{renderExercise(ex)}</div>
        </div>

        {/* 答题反馈（在滚动区域内，只显示结果提示） */}
        {answered && (
          <div className="pt-4 animate-[fade-in_0.3s_ease-out]">
            <div
              className={`text-center py-2 rounded-xl text-sm font-semibold ${
                savedResults?.[ex.id]?.correct ? 'text-success' : 'text-error'
              }`}
            >
              {savedResults?.[ex.id]?.correct ? '✨ 太棒了，回答正确！' : '💡 没关系，继续加油！'}
            </div>
          </div>
        )}

        {/* 未答题时的重做提示 */}
        {!answered && savedResults?.[ex.id]?.answered && (
          <div className="pt-4 text-center">
            <p className="text-sm text-text-muted">
              {savedResults[ex.id].correct ? '✅ 此题你之前已答对' : '❌ 此题你之前答错了'}
            </p>
            <button
              onClick={handleReset}
              className="mt-2 text-sm text-primary hover:text-primary-dark transition"
            >
              🔄 重新挑战所有题
            </button>
          </div>
        )}
      </main>

      {/* ── 下一题按钮（固定在底部，不随滚动） ── */}
      {answered && (
        <div className="flex-shrink-0 max-w-2xl w-full mx-auto px-4 pb-6 pt-3 animate-[fade-in_0.3s_ease-out]">
          <button
            onClick={handleNext}
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-dark active:scale-[0.98] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            {current < totalCount - 1 ? '下一题' : '查看挑战结果'}
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  )
}

export default GamePage
