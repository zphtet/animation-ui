import { animate, motion, useAnimationFrame, useMotionValue, useTransform, type MotionValue } from 'framer-motion'
import { useEffect } from 'react'
import { Critter } from '../art/Critter'
import { PALS, type Pal } from '../data/pals'
import { WaveText } from '../motion/WaveText'

import { Scene } from '@/stage/Scence'
import { useStage } from '../stage/stage'

const IDLE_SPEED = 0.12 // radians per second of idle drift while the page is showing
// orbiting pals 
function OrbitPal({
    pal,
    index,
    count,
    angle,
}: {
    pal: Pal
    index: number
    count: number
    angle: MotionValue<number>
}) {
    const base = (index / count) * Math.PI * 2
    const x = useTransform(angle, (a) => `calc(var(--rx) * ${Math.cos(base + a).toFixed(4)})`)
    const y = useTransform(angle, (a) => `calc(var(--ry) * ${Math.sin(base + a).toFixed(4)})`)
    // A gentle tumble as they travel.
    const rotate = useTransform(angle, (a) => (index % 2 ? 1 : -1) * 16 + Math.sin(base + a) * 12)

    return (
        <motion.div className="absolute top-0 left-0" style={{ x, y, rotate }}>
            <div className="w-[clamp(56px,13vmin,140px)] -translate-x-1/2 -translate-y-1/2">
                <Critter {...pal} className="w-full" />
            </div>
        </motion.div>
    )
}

/** Counts up to 3,333 each time the page arrives. */
function Counter({ active }: { active: boolean }) {
    const count = useMotionValue(0)
    const text = useTransform(count, (v) => Math.round(v).toLocaleString('en-US'))
    useEffect(() => {
        const controls = active
            ? animate(count, 3333, { duration: 1.8, delay: 0.5, ease: [0.33, 1, 0.68, 1] })
            : animate(count, 0, { duration: 0.6 })
        return () => controls.stop()
    }, [active, count])
    return <motion.span>{text}</motion.span>
}

// orbit page
export function Orbit() {
    const { page, position } = useStage()
    const active = page === 2

    // The page transition turns the ring; an idle drift keeps it moving while it is showing.
    const travel = useTransform(position, [1, 3], [-1.4, 1.4])
    const idle = useMotionValue(0)
    useAnimationFrame((_, delta) => {
        if (active) idle.set(idle.get() + (delta / 1000) * IDLE_SPEED)
    })
    const angle = useTransform(() => travel.get() + idle.get())

    const ringScale = useTransform(position, [1.3, 2, 3], [2.6, 1, 0.8])
    const ringOpacity = useTransform(position, [1.3, 1.7], [0, 1])
    const panX = useTransform(position, [2, 3], ['0vw', '-70vw'])
    const copyOpacity = useTransform(position, [1.6, 2, 2.5], [0, 1, 0])
    const copyScale = useTransform(position, [1.6, 2], [0.85, 1])

    const pals = PALS.slice(0, 14)

    return (
        <Scene index={2} label="The collection in numbers">
            <motion.div
                className="flex h-full items-center justify-center [--rx:min(37vw,50vh)] [--ry:min(34svh,78vw)] sm:[--rx:min(38vw,52vh)] sm:[--ry:min(36vh,30vw)]"
                style={{ x: panX }}
            >
                <motion.div
                    aria-hidden
                    className="absolute top-1/2 left-1/2 size-0"
                    style={{ scale: ringScale, opacity: ringOpacity }}
                >
                    {pals.map((pal, i) => (
                        <OrbitPal key={i} pal={pal} index={i} count={pals.length} angle={angle} />
                    ))}
                </motion.div>

                <motion.div
                    className="relative max-w-[min(72vw,32rem)] text-center"
                    style={{ opacity: copyOpacity, scale: copyScale }}
                >
                    <p className="font-display text-[clamp(3rem,9vmin,6.5rem)] leading-none font-bold text-navy tabular-nums">
                        <Counter active={active} />
                    </p>
                    <h2 className="mt-1 font-display text-xs font-semibold tracking-[0.2em] whitespace-nowrap text-navy/60 uppercase sm:text-sm sm:tracking-[0.3em]">
                        one-of-a-kind pals
                    </h2>
                    <WaveText
                        show={active}
                        delay={0.8}
                        lines={['Each Fluffy PAL is drawn from', 'hundreds of hand-made traits,', 'so yours is the only one.']}
                        className="mt-5 text-[clamp(0.9rem,2.2vmin,1.2rem)] leading-loose tracking-[0.06em] text-navy/85 sm:tracking-[0.14em]"
                    />
                </motion.div>
            </motion.div>
        </Scene>
    )
}
