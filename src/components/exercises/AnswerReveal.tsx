import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface Props {
  analysis: string
}

function AnswerReveal({ analysis }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition"
      >
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-0' : '-rotate-90'}`} />
        {open ? '收起解析' : '查看解析'}
      </button>
      {open && (
        <div className="mt-2 pl-3 border-l-2 border-blue-200 text-sm text-gray-600 leading-relaxed">
          {analysis}
        </div>
      )}
    </div>
  )
}

export default AnswerReveal
