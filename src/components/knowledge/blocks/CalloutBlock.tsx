import { AlertTriangle, Lightbulb, Info, BookOpen } from 'lucide-react'
import type { CalloutBlock } from '@/types'
import { renderInline } from '@/utils/renderInline'

interface Props {
  block: CalloutBlock
}

const variantStyles: Record<CalloutBlock['variant'], { border: string; bg: string; icon: React.ReactNode }> = {
  warning: {
    border: 'border-l-red-500',
    bg: 'bg-gradient-to-r from-red-50 to-white',
    icon: <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />,
  },
  tip: {
    border: 'border-l-success',
    bg: 'bg-gradient-to-r from-success-bg to-white',
    icon: <Lightbulb className="w-5 h-5 text-success shrink-0" />,
  },
  note: {
    border: 'border-l-blue-500',
    bg: 'bg-gradient-to-r from-blue-50 to-white',
    icon: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
  },
  mnemonic: {
    border: 'border-l-purple-500',
    bg: 'bg-gradient-to-r from-purple-50 to-white',
    icon: <BookOpen className="w-5 h-5 text-purple-500 shrink-0" />,
  },
}

function CalloutBlockComponent({ block }: Props) {
  const style = variantStyles[block.variant]

  return (
    <div className={`my-3 border-l-4 ${style.border} ${style.bg} rounded-r-[10px] p-3.5 animate-slide-up`}>
      <div className="flex items-start gap-2">
        {style.icon}
        <div>
          {block.title && (
            <div className="font-semibold text-text mb-1 text-sm">{renderInline(block.title)}</div>
          )}
          {block.content && (
            <p className="text-text-secondary text-sm leading-relaxed">{renderInline(block.content)}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default CalloutBlockComponent
