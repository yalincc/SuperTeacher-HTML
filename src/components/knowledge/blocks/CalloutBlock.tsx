import { AlertTriangle, Lightbulb, Info, BookOpen } from 'lucide-react'
import type { CalloutBlock } from '@/types'
import { renderInline } from '@/utils/renderInline'

interface Props {
  block: CalloutBlock
}

const variantStyles: Record<CalloutBlock['variant'], { bg: string; border: string; iconBg: string; icon: React.ReactNode }> = {
  warning: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    iconBg: 'bg-red-100',
    icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
  },
  tip: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    iconBg: 'bg-emerald-100',
    icon: <Lightbulb className="w-5 h-5 text-emerald-600" />,
  },
  note: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    iconBg: 'bg-blue-100',
    icon: <Info className="w-5 h-5 text-blue-500" />,
  },
  mnemonic: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    iconBg: 'bg-purple-100',
    icon: <BookOpen className="w-5 h-5 text-purple-500" />,
  },
}

function CalloutBlockComponent({ block }: Props) {
  const style = variantStyles[block.variant]

  return (
    <div className={`my-5 ${style.bg} ${style.border} border rounded-2xl p-5 animate-slide-up`}>
      <div className="flex items-start gap-3.5">
        <div className={`w-10 h-10 ${style.iconBg} rounded-full flex items-center justify-center shrink-0`}>
          {style.icon}
        </div>
        <div className="flex-1 min-w-0">
          {block.title && (
            <div className="font-semibold text-text mb-1.5 text-base">{renderInline(block.title)}</div>
          )}
          {block.content && (
            <p className="text-text-secondary text-sm leading-loose">{renderInline(block.content)}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default CalloutBlockComponent
