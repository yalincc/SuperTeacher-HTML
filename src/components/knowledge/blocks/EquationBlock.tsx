import type { EquationBlock } from '@/types'
import KaTeX from '@/components/ui/KaTeX'

interface Props {
  block: EquationBlock
}

function EquationBlockComponent({ block }: Props) {
  return <KaTeX block={block} />
}

export default EquationBlockComponent
