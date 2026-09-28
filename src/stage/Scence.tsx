import { motion, useTransform } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { OnStageContext, useStage } from './stage'

// Sence  componet for holding the sences ( pages)
export function Scene({
    index,
    label,
    className,
    children,
}: {
    index: number
    label: string
    className?: string
    children: ReactNode
}) {
    const { page, position } = useStage()
    const visibility = useTransform(position, (p) => (Math.abs(p - index) < 1 ? 'visible' : 'hidden'))

    return (
        <motion.section
            aria-label={label}
            inert={page !== index}
            className={cn('absolute inset-0 overflow-hidden', className)}
            style={{ visibility }}
        >
            <OnStageContext value={Math.abs(page - index) <= 1}>{children}</OnStageContext>
        </motion.section>
    )
}
