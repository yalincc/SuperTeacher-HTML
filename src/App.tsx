import { HashRouter, Routes, Route, useParams } from 'react-router-dom'
import { ProgressContext } from './hooks/ProgressContext'
import { useProgress } from './hooks/useProgress'
import { GameContext } from './hooks/useGame'
import { useGame } from './hooks/useGame'
import { isGroupId } from './data'
import AppLayout from './components/layout/AppLayout'
import HomePage from './pages/HomePage'
import CoursePage from './pages/CoursePage'
import SemesterPage from './pages/SemesterPage'
import LessonPage from './pages/LessonPage'
import LessonComplete from './pages/LessonComplete'
import GamePage from './pages/GamePage'

function CourseProvider({ children }: { children: React.ReactNode }) {
  const { courseId } = useParams<{ courseId: string }>()
  if (!courseId) return null

  const progressValue = useProgress(courseId)
  const gameValue = useGame(courseId)

  return (
    <ProgressContext.Provider value={progressValue}>
      <GameContext.Provider value={gameValue}>
        {children}
      </GameContext.Provider>
    </ProgressContext.Provider>
  )
}

function CourseEntry() {
  const { courseId } = useParams<{ courseId: string }>()
  if (courseId && isGroupId(courseId)) {
    return <SemesterPage />
  }
  return (
    <CourseProvider>
      <CoursePage />
    </CourseProvider>
  )
}

function App() {
  // HashRouter 的 basename 匹配的是 URL 中 # 之后的路由路径（恒为 "/"），
  // 不能用部署子路径（如 /SuperTeacher-HTML/）。部署子路径仅由 Vite base 处理静态资源加载。
  // 之前在 GitHub Pages 子路径下把子路径当 basename，会导致无法匹配 #/ 而白屏。
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/course/:courseId" element={<CourseEntry />} />
          <Route path="/course/:courseId/lesson/:id" element={
            <CourseProvider>
              <LessonPage />
            </CourseProvider>
          } />
          <Route path="/course/:courseId/lesson/:id/game" element={
            <CourseProvider>
              <GamePage />
            </CourseProvider>
          } />
          <Route path="/course/:courseId/lesson/:id/complete" element={<LessonComplete />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
