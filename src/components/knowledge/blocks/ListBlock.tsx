import type { ListBlock } from '@/types'
import { renderInline } from '@/utils/renderInline'

interface Props {
  block: ListBlock
}

function ListBlockComponent({ block }: Props) {
  if (block.ordered) {
    return (
      <ol className="my-4 ml-1 space-y-2 text-text list-none counter-reset-item">
        {block.items.map((item, i) => (
          <li key={i} className="leading-loose pl-8 relative tracking-wide">
            <span className="absolute left-0 top-0.5 w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
              {i + 1}
            </span>
            {renderInline(item)}
          </li>
        ))}
      </ol>
    )
  }

  return (
    <ul className="my-4 ml-1 space-y-2 text-text list-none">
      {block.items.map((item, i) => (
        <li key={i} className="leading-loose pl-6 relative tracking-wide">
          <span className="absolute left-0 top-2.5 w-2.5 h-2.5 rounded-full bg-primary" />
          {renderInline(item)}
        </li>
      ))}
    </ul>
  )
}

export default ListBlockComponent
