import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { renderInline } from '@/utils/renderInline'

interface Props {
  analysis: string
}

function AnswerReveal({ analysis }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-sm text-primary hover:text-primary-dark transition-colors"
      >
        <ChevronDown className={`w-4 h-4 transition-transform duration-250 ${open ? 'rotate-0' : '-rotate-90'}`} />
        {open ? '收起解析' : '查看解析'}
      </button>
      {open && (
        <div className="mt-2 pl-3.5 border-l-2 border-primary/30 text-sm text-text-secondary leading-relaxed animate-fade-in">
          {renderInline(analysis)}
        </div>
      )}
    </div>
  )
}

export default AnswerReveal
