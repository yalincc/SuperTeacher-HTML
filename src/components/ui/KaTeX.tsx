import { useRef, useEffect } from 'react'
import katex from 'katex'
import type { EquationBlock } from '@/types'

interface KaTeXProps {
  block: EquationBlock
}

function EquationBlockComponent({ block }: KaTeXProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      katex.render(block.latex, ref.current, {
        displayMode: block.display,
        throwOnError: false,
      })
    }
  }, [block.latex, block.display])

  return (
    <div
      ref={ref}
      className={`my-5 ${
        block.display
          ? 'text-center bg-surface-warm border border-border rounded-2xl py-6 px-8 shadow-sm'
          : 'inline'
      }`}
    />
  )
}

export default EquationBlockComponent
