import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { cn } from '../lib/cn'



export function PalCard({ children, className, max = 12 }: { children: ReactNode; className?: string; max?: number }) {

    const px = useMotionValue(0.5)
    const py = useMotionValue(0.5)
    const hover = useMotionValue(0)
    const spring = { stiffness: 180, damping: 18 }
    const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring)
    const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring)
    const lift = useSpring(useTransform(hover, [0, 1], [0, -12]), spring)
    const glareOpacity = useSpring(hover, spring)
    const gx = useTransform(px, [0, 1], ['0%', '100%'])
    const gy = useTransform(py, [0, 1], ['0%', '100%'])
    const glare = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgb(255 255 255 / 0.45), transparent 55%)`
    const rect = useRef<DOMRect | null>(null)

    return (
        <motion.div
            className={cn('relative [transform-style:preserve-3d]', className)}
            style={{ rotateX, rotateY, y: lift }}
            onPointerEnter={(event) => {
                rect.current = event.currentTarget.getBoundingClientRect()
                hover.set(1)
            }}
            onPointerMove={(event) => {
                const r = rect.current
                if (!r) return
                px.set((event.clientX - r.left) / r.width)
                py.set((event.clientY - r.top) / r.height)
            }}
            onPointerLeave={() => {
                px.set(0.5)
                py.set(0.5)
                hover.set(0)
            }}
        >
            {children}
            <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[inherit]"
                style={{ background: glare, opacity: glareOpacity }}
            />
        </motion.div>
    )
}
