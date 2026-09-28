import { animate, useMotionValue, type MotionValue } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { StageContext } from './stage'

/** Slow in, slow out, like a camera move between scenes. */
const EASE = [0.65, 0, 0.35, 1] as const
const DURATION = 1.3 // seconds per page
const WHEEL_THRESHOLD = 30 // px of wheel travel before we change page
const SWIPE_THRESHOLD = 50 // px of vertical swipe before we change page

function useStageInput(step: (direction: 1 | -1) => void, jump: (page: 'first' | 'last') => void, enabled: boolean) {
    useEffect(() => {
        if (!enabled) return

        let wheelTotal = 0
        let lastWheelTime = 0
        let lastWheelDelta = 0
        const onWheel = (event: WheelEvent) => {
            // Horizontal gestures belong to the gallery track, not to page changes.
            if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return
            const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY // Firefox reports lines
            const now = performance.now()
            const inertia = now - lastWheelTime < 100 && Math.abs(delta) <= Math.abs(lastWheelDelta)
            lastWheelTime = now
            lastWheelDelta = delta
            if (inertia) return

            wheelTotal += delta
            if (Math.abs(wheelTotal) >= WHEEL_THRESHOLD) {
                step(wheelTotal > 0 ? 1 : -1)
                wheelTotal = 0
            }
        }

        let touchX = 0
        let touchY = 0
        const onTouchStart = (event: TouchEvent) => {
            touchX = event.touches[0]!.clientX
            touchY = event.touches[0]!.clientY
        }
        const onTouchEnd = (event: TouchEvent) => {
            const dx = event.changedTouches[0]!.clientX - touchX
            const dy = event.changedTouches[0]!.clientY - touchY
            if (Math.abs(dy) > SWIPE_THRESHOLD && Math.abs(dy) > Math.abs(dx)) step(dy < 0 ? 1 : -1)
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.altKey || event.ctrlKey || event.metaKey) return
            // Space on a focused button or link should click it, not change page.
            if (event.key === ' ' && (event.target as Element).closest('button, a')) return
            if (['ArrowDown', 'PageDown', ' '].includes(event.key)) step(1)
            else if (['ArrowUp', 'PageUp'].includes(event.key)) step(-1)
            else if (event.key === 'Home') jump('first')
            else if (event.key === 'End') jump('last')
            else return
            event.preventDefault()
        }

        window.addEventListener('wheel', onWheel, { passive: true })
        window.addEventListener('touchstart', onTouchStart, { passive: true })
        window.addEventListener('touchend', onTouchEnd, { passive: true })
        window.addEventListener('keydown', onKeyDown)
        return () => {
            window.removeEventListener('wheel', onWheel)
            window.removeEventListener('touchstart', onTouchStart)
            window.removeEventListener('touchend', onTouchEnd)
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [step, jump, enabled])
}

function travel(position: MotionValue<number>, to: number) {
    // Longer jumps (e.g. "back to top" from the last page) get a little more time, so the scenes in between still read.
    const distance = Math.abs(to - position.get())
    const duration = DURATION + 0.35 * Math.max(0, distance - 1)
    animate(position, to, { duration, ease: EASE })
}


// stage provier for stahe
export function StageProvider({ count, enabled, children }: { count: number; enabled: boolean; children: ReactNode }) {
    const position = useMotionValue(0)
    const [page, setPage] = useState(0)
    const pageRef = useRef(0)

    const goTo = useCallback(
        (target: number, { instant = false } = {}) => {
            const next = Math.max(0, Math.min(count - 1, target))
            if (next === pageRef.current) return
            pageRef.current = next
            setPage(next)
            if (instant) position.jump(next)
            else travel(position, next,)
        },
        [count, position],
    )

    const step = useCallback(
        (direction: 1 | -1) => {
            if (!position.isAnimating()) goTo(pageRef.current + direction)
        },
        [goTo, position],
    )
    const jump = useCallback((to: 'first' | 'last') => goTo(to === 'first' ? 0 : count - 1), [count, goTo])

    useStageInput(step, jump, enabled)

    const stage = useMemo(() => ({ page, count, position, goTo }), [page, count, position, goTo])
    return <StageContext value={stage}>{children}</StageContext>
}
