import type { ListBlock } from '@/types'

interface Props {
  block: ListBlock
}

function ListBlockComponent({ block }: Props) {
  if (block.ordered) {
    return (
      <ol className="my-2 ml-6 list-decimal space-y-1 text-gray-700">
        {block.items.map((item, i) => (
          <li key={i} className="leading-relaxed">{item}</li>
        ))}
      </ol>
    )
  }

  return (
    <ul className="my-2 ml-6 list-disc space-y-1 text-gray-700">
      {block.items.map((item, i) => (
        <li key={i} className="leading-relaxed">{item}</li>
      ))}
    </ul>
  )
}

export default ListBlockComponent
