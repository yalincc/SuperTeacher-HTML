import { AlertTriangle, Lightbulb, Info, BookOpen } from 'lucide-react'
import type { CalloutBlock } from '@/types'

interface Props {
  block: CalloutBlock
}

const variantStyles: Record<CalloutBlock['variant'], { border: string; bg: string; icon: React.ReactNode }> = {
  warning: {
    border: 'border-l-red-500',
    bg: 'bg-red-50',
    icon: <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />,
  },
  tip: {
    border: 'border-l-green-500',
    bg: 'bg-green-50',
    icon: <Lightbulb className="w-5 h-5 text-green-500 shrink-0" />,
  },
  note: {
    border: 'border-l-blue-500',
    bg: 'bg-blue-50',
    icon: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
  },
  mnemonic: {
    border: 'border-l-purple-500',
    bg: 'bg-purple-50',
    icon: <BookOpen className="w-5 h-5 text-purple-500 shrink-0" />,
  },
}

function CalloutBlockComponent({ block }: Props) {
  const style = variantStyles[block.variant]

  return (
    <div className={`my-3 border-l-4 ${style.border} ${style.bg} rounded-r-lg p-4`}>
      <div className="flex items-start gap-2">
        {style.icon}
        <div>
          {block.title && (
            <div className="font-semibold text-gray-800 mb-1">{block.title}</div>
          )}
          <p className="text-gray-700 text-sm leading-relaxed">{block.content}</p>
        </div>
      </div>
    </div>
  )
}

export default CalloutBlockComponent
