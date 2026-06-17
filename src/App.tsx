import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProgressContext } from './hooks/ProgressContext'
import { useProgress } from './hooks/useProgress'
import { GameContext } from './hooks/useGame'
import { useGame } from './hooks/useGame'
import AppLayout from './components/layout/AppLayout'
import HomePage from './pages/HomePage'
import LessonPage from './pages/LessonPage'
import GamePage from './pages/GamePage'

function App() {
  const progressValue = useProgress()
  const gameValue = useGame()

  return (
    <ProgressContext.Provider value={progressValue}>
      <GameContext.Provider value={gameValue}>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/lesson/:id" element={<LessonPage />} />
              <Route path="/lesson/:id/game" element={<GamePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </GameContext.Provider>
    </ProgressContext.Provider>
  )
}

export default App
