import type { ParagraphBlock } from '@/types'
import { renderInline } from '@/utils/renderInline'

interface Props {
  block: ParagraphBlock
}

function ParagraphBlockComponent({ block }: Props) {
  return (
    <p className="text-text leading-loose my-4 tracking-wide">
      {renderInline(block.content)}
    </p>
  )
}

export default ParagraphBlockComponent
