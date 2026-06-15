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
      className={`my-3 ${block.display ? 'text-center bg-[#fef3c7] border-l-[3px] border-primary rounded-r-[6px] py-4 px-6 font-mono' : 'inline'}`}
    />
  )
}

export default EquationBlockComponent
