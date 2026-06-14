import type { ParagraphBlock } from '@/types'

interface Props {
  block: ParagraphBlock
}

function ParagraphBlockComponent({ block }: Props) {
  return (
    <p className="text-gray-700 leading-relaxed my-2">
      {block.content}
    </p>
  )
}

export default ParagraphBlockComponent
