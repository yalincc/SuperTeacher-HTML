import type { AnimationBlock } from '@/types'

interface Props {
  block: AnimationBlock
}

function AnimationBlockComponent({ block }: Props) {
  return (
    <div className="my-4 text-center">
      <img
        src={block.src}
        alt={block.alt || ''}
        className="inline-block rounded-lg"
        style={block.width ? { width: block.width } : undefined}
      />
    </div>
  )
}

export default AnimationBlockComponent
