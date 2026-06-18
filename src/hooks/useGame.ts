import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import type { GameState, ModuleName } from '@/types'
import { INITIAL_HEARTS, MODULE_ORDER } from '@/types'

function getGameKey(courseId: string): string {
  return `superteacher_game_${courseId}`
}

function createInitialState(): GameState {
  return {
    version: 1,
    hearts: INITIAL_HEARTS,
    maxHearts: INITIAL_HEARTS,
    unlockedLessons: [],
    unlockedModules: {},
  }
}

function loadGameState(courseId: string): GameState {
  try {
    const raw = localStorage.getItem(getGameKey(courseId))
    if (!raw) return createInitialState()
    const data = JSON.parse(raw) as GameState
    if (data.version !== 1) return createInitialState()
    return data
  } catch {
    return createInitialState()
  }
}

function saveGameState(courseId: string, state: GameState): void {
  localStorage.setItem(getGameKey(courseId), JSON.stringify(state))
}

interface GameContextValue {
  courseId: string
  hearts: number
  maxHearts: number
  isLessonUnlocked: (lessonId: number) => boolean
  isModuleUnlocked: (lessonId: number, module: ModuleName) => boolean
  useHeart: () => boolean
  resetHearts: () => void
  completeModule: (lessonId: number, module: ModuleName) => void
  unlockNextModule: (lessonId: number, currentModule: ModuleName) => void
}

const GameContext = createContext<GameContextValue | null>(null)

export function useGameContext() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGameContext must be used within GameProvider')
  return ctx
}

export function useGame(courseId: string) {
  const [state, setState] = useState<GameState>(() => loadGameState(courseId))

  const useHeart = useCallback((): boolean => {
    let heartUsed = false
    setState((prev) => {
      if (prev.hearts <= 0) return prev
      heartUsed = true
      const next = { ...prev, hearts: prev.hearts - 1 }
      saveGameState(courseId, next)
      return next
    })
    return heartUsed
  }, [courseId])

  const resetHearts = useCallback(() => {
    setState((prev) => {
      const next = { ...prev, hearts: prev.maxHearts }
      saveGameState(courseId, next)
      return next
    })
  }, [courseId])

  const isLessonUnlocked = useCallback(
    (_lessonId: number): boolean => {
      return true
    },
    []
  )

  const isModuleUnlocked = useCallback(
    (_lessonId: number, _module: ModuleName): boolean => {
      return true
    },
    []
  )

  const completeModule = useCallback((lessonId: number, module: ModuleName) => {
    setState((prev) => {
      const key = String(lessonId)
      const modules = prev.unlockedModules[key] || []
      if (modules.includes(module)) return prev

      const next = {
        ...prev,
        unlockedModules: {
          ...prev.unlockedModules,
          [key]: [...modules, module],
        },
      }
      saveGameState(courseId, next)
      return next
    })
  }, [courseId])

  const unlockNextModule = useCallback((lessonId: number, currentModule: ModuleName) => {
    setState((prev) => {
      const currentIdx = MODULE_ORDER.indexOf(currentModule)
      if (currentIdx < 0 || currentIdx >= MODULE_ORDER.length - 1) return prev

      const nextModuleName = MODULE_ORDER[currentIdx + 1]
      const key = String(lessonId)
      const modules = prev.unlockedModules[key] || []

      if (modules.includes(nextModuleName)) return prev

      const next = {
        ...prev,
        unlockedModules: {
          ...prev.unlockedModules,
          [key]: [...modules, nextModuleName],
        },
      }
      saveGameState(courseId, next)
      return next
    })
  }, [courseId])

  const value = useMemo<GameContextValue>(
    () => ({
      courseId,
      hearts: state.hearts,
      maxHearts: state.maxHearts,
      isLessonUnlocked,
      isModuleUnlocked,
      useHeart,
      resetHearts,
      completeModule,
      unlockNextModule,
    }),
    [courseId, state, isLessonUnlocked, isModuleUnlocked, useHeart, resetHearts, completeModule, unlockNextModule]
  )

  return value
}

export { GameContext }
