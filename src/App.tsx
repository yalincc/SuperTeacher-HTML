import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProgressContext } from './hooks/ProgressContext'
import { useProgress } from './hooks/useProgress'
import AppLayout from './components/layout/AppLayout'
import HomePage from './pages/HomePage'
import LessonPage from './pages/LessonPage'

function App() {
  const progressValue = useProgress()

  return (
    <ProgressContext.Provider value={progressValue}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/lesson/:id" element={<LessonPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ProgressContext.Provider>
  )
}

export default App
