import { useState } from 'react'
import { ChevronDown, ChevronRight, Star } from 'lucide-react'
import type { Objective } from '@/types'

interface Props {
  objectives: Objective[]
  onComplete?: () => void
}

function SectionObjectives({ objectives, onComplete }: Props) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">一</span>
        学习目标
      </h2>
      <ul className="space-y-2">
        {objectives.map((obj, i) => (
          <li key={i} className="flex items-start gap-2">
            {obj.isKeyPoint ? (
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 shrink-0 mt-0.5" />
            ) : (
              <span className="w-4 h-4 shrink-0 mt-0.5 flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
              </span>
            )}
            <span className={`text-sm ${obj.isKeyPoint ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
              {obj.text}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default SectionObjectives
