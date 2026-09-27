import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useOnStage } from '@/stage/stage'

/**
 * Idle "floating" loop (bob + sway). Only runs while its scene is on stage, and not at all
 * in the lite tier, so off-stage scenes and low-power devices do no animation work.
 */
export function Float({
  children,
  amplitude = 10,
  sway = 3,
  duration = 4,
  delay = 0,
  className,
}: {
  children: ReactNode
  amplitude?: number
  sway?: number
  duration?: number
  delay?: number
  className?: string
}) {
  const onStage = useOnStage()
  const active = onStage

  return (
    <motion.div
      className={className}
      animate={active ? { y: [0, -amplitude, 0], rotate: [-sway, sway, -sway] } : { y: 0, rotate: 0 }}
      transition={active ? { duration, delay, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.4 }}
    >
      {children}
    </motion.div>
  )
}
