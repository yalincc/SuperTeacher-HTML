import { useEffect, useState } from 'react'

interface Props {
  type: 'correct' | 'wrong'
  gifSrc?: string
  duration?: number
  onComplete?: () => void
}

const DEFAULT_GIFS = {
  correct: '/gifs/correct.gif',
  wrong: '/gifs/wrong.gif',
}

function AnswerAnimation({ type, gifSrc, duration = 1500, onComplete }: Props) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      onComplete?.()
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onComplete])

  if (!visible) return null

  const src = gifSrc || DEFAULT_GIFS[type]

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="animate-bounce-in">
        <img
          src={src}
          alt={type === 'correct' ? '回答正确' : '回答错误'}
          className="w-48 h-48 object-contain drop-shadow-lg"
        />
      </div>
    </div>
  )
}

export default AnswerAnimation
