import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import { ProgressContext } from './hooks/ProgressContext'
import { useProgress } from './hooks/useProgress'
import { GameContext } from './hooks/useGame'
import { useGame } from './hooks/useGame'
import AppLayout from './components/layout/AppLayout'
import HomePage from './pages/HomePage'
import CoursePage from './pages/CoursePage'
import LessonPage from './pages/LessonPage'
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/course/:courseId" element={
            <CourseProvider>
              <CoursePage />
            </CourseProvider>
          } />
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
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
