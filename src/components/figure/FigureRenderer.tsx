import { lazy, Suspense } from 'react'
import type { Figure } from '@/types/figure'

const GeometryBoard = lazy(() => import('./GeometryBoard'))
const FunctionBoard = lazy(() => import('./FunctionBoard'))
const ConstructionBoard = lazy(() => import('./ConstructionBoard'))

interface Props {
  figure?: Figure
}

function FigureRenderer({ figure }: Props) {
  if (!figure) return null

  const Fallback = () => (
    <div className="flex justify-center my-3">
      <div className="w-full max-w-[400px] aspect-square bg-gray-50 rounded-xl animate-pulse" />
    </div>
  )

  return (
    <Suspense fallback={<Fallback />}>
      {figure.type === 'geometry' && <GeometryBoard figure={figure} />}
      {figure.type === 'function' && <FunctionBoard figure={figure} />}
      {figure.type === 'construction' && <ConstructionBoard figure={figure} />}
      {figure.type === 'composite' && (
        <div>
          {figure.geometry && <GeometryBoard figure={figure.geometry} />}
          {figure.functions && <FunctionBoard figure={figure.functions} />}
        </div>
      )}
    </Suspense>
  )
}

export default FigureRenderer
