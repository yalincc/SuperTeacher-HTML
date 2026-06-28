import type { ContentBlock } from '@/types'
import { lazy, Suspense } from 'react'
import ParagraphBlock from './blocks/ParagraphBlock'
import TableBlock from './blocks/TableBlock'
import CalloutBlock from './blocks/CalloutBlock'
import EquationBlock from './blocks/EquationBlock'
import ListBlock from './blocks/ListBlock'
import AnimationBlock from './blocks/AnimationBlock'
import TimelineBlock from './blocks/TimelineBlock'

const FigureRenderer = lazy(() => import('../figure/FigureRenderer'))

interface Props {
  blocks: ContentBlock[]
}

function ContentRenderer({ blocks }: Props) {
  return (
    <div>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'paragraph':
            return <ParagraphBlock key={i} block={block} />
          case 'table':
            return <TableBlock key={i} block={block} />
          case 'callout':
            return <CalloutBlock key={i} block={block} />
          case 'equation':
            return <EquationBlock key={i} block={block} />
          case 'list':
            return <ListBlock key={i} block={block} />
          case 'animation':
            return <AnimationBlock key={i} block={block} />
          case 'timeline':
            return <TimelineBlock key={i} block={block} />
          case 'figure':
            return (
              <Suspense key={i} fallback={<div className="h-48 bg-gray-50 rounded-xl animate-pulse" />}>
                <FigureRenderer figure={block.figure} />
              </Suspense>
            )
          default:
            return (
              <p key={i} className="text-red-400 text-sm italic">
                未知块类型: {(block as ContentBlock).type}
              </p>
            )
        }
      })}
    </div>
  )
}

export default ContentRenderer
