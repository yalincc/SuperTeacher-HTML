import type { ListBlock } from '@/types'
import { renderInline } from '@/utils/renderInline'

interface Props {
  block: ListBlock
}

function ListBlockComponent({ block }: Props) {
  if (block.ordered) {
    return (
      <ol className="my-2.5 ml-6 list-decimal space-y-1 text-text marker:text-primary marker:font-semibold">
        {block.items.map((item, i) => (
          <li key={i} className="leading-relaxed pl-1">{renderInline(item)}</li>
        ))}
      </ol>
    )
  }

  return (
    <ul className="my-2.5 ml-6 list-disc space-y-1 text-text marker:text-primary">
      {block.items.map((item, i) => (
        <li key={i} className="leading-relaxed pl-1">{renderInline(item)}</li>
      ))}
    </ul>
  )
}

export default ListBlockComponent
