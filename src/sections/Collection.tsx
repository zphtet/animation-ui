import {
    motion,
    useAnimationFrame,
    useMotionValue,
    useTransform,
    wrap,
    type MotionValue,
    type PanInfo,
    type Variants,
} from 'framer-motion'
import { useRef, useState, type FocusEvent, type RefObject } from 'react'
import { Critter } from '../art/Critter'
import { FishIcon, StarIcon } from '../art/icons'
import { COLLECTION, type CollectionItem } from '../data/pals'
import { Float } from '../motion/Float'
import { SplitText } from '../motion/SplitText'
import { PalCard } from '../motion/PalCard'
import { Scene } from '@/stage/Scence'
import { useStage } from '../stage/stage'

const RARITY_TONE: Record<CollectionItem['rarity'], string> = {
    Common: 'bg-white/15 text-white',
    Rare: 'bg-sky/25 text-sky',
    Epic: 'bg-lilac/25 text-lilac',
    Legendary: 'bg-butter/25 text-butter',
}


const FLOATERS = [
    { kind: 'fish', top: '18%', left: 12, depth: 1, color: '#4cc9f0', size: 'w-8' },
    { kind: 'star', top: '26%', left: 38, depth: 0.4, color: '#d9f36b', size: 'w-7' },
    { kind: 'fish', top: '70%', left: 30, depth: 1.6, color: '#3a7bff', size: 'w-10' },
    { kind: 'star', top: '14%', left: 62, depth: 0.6, color: '#ff8fc7', size: 'w-5' },
    { kind: 'fish', top: '64%', left: 78, depth: 1.2, color: '#4cc9f0', size: 'w-9' },
    { kind: 'star', top: '40%', left: 88, depth: 0.9, color: '#d9f36b', size: 'w-6' },
    { kind: 'fish', top: '32%', left: 104, depth: 1.8, color: '#ff8fc7', size: 'w-7' },
    { kind: 'star', top: '78%', left: 120, depth: 1.4, color: '#a9dcff', size: 'w-8' },
] as const

const DRIFT_SPEED = -40 // px per second; negative drifts the row to the left

const track: Variants = {
    hidden: {},
    shown: { transition: { staggerChildren: 0.08, delayChildren: 0.5 } },
}
const card: Variants = {
    hidden: (i: number) => ({ opacity: 0, y: 80, rotate: i % 2 ? 4 : -4 }),
    shown: { opacity: 1, y: 0, rotate: 0, transition: { type: 'spring', stiffness: 90, damping: 16 } },
}


function useMarquee(listRef: RefObject<HTMLUListElement | null>, count: number, drifting: boolean) {
    const x = useMotionValue(0)
    const travel = useMotionValue(0)
    const velocity = useRef(DRIFT_SPEED)
    const dragging = useRef(false)
    const hovered = useRef(false)
    const focused = useRef(false)

    function move(dx: number) {
        const cards = listRef.current?.children
        if (!cards || cards.length <= count) return
        // One copy's width, gap included: from the first card to its duplicate.
        const period = (cards[count] as HTMLElement).offsetLeft - (cards[0] as HTMLElement).offsetLeft
        if (period <= 0) return
        travel.set(travel.get() + dx)
        x.set(wrap(-period, 0, x.get() + dx))
    }

    useAnimationFrame((_, delta) => {
        if (dragging.current) return
        const seconds = Math.min(delta, 100) / 1000 // a backgrounded tab resumes without a leap
        const target = drifting && !hovered.current && !focused.current ? DRIFT_SPEED : 0
        velocity.current += (target - velocity.current) * Math.min(1, seconds * 3)
        move(velocity.current * seconds)
    })

    const handlers = {
        onPanStart: () => {
            dragging.current = true
        },
        onPan: (_: PointerEvent, info: PanInfo) => move(info.delta.x),
        onPanEnd: (_: PointerEvent, info: PanInfo) => {
            dragging.current = false
            velocity.current = info.velocity.x
        },
        onHoverStart: () => {
            hovered.current = true
        },
        onHoverEnd: () => {
            hovered.current = false
        },
        // Only keyboard focus pauses: a mouse click also focuses the card, and that shouldn't stop the row for good.
        onFocus: (event: FocusEvent) => {
            focused.current = event.target.matches(':focus-visible')
        },
        onBlur: () => {
            focused.current = false
        },
    }
    return { x, travel, handlers }
}

function Floater({
    item,
    index,
    travel,
}: {
    item: (typeof FLOATERS)[number]
    index: number
    travel: MotionValue<number>
}) {
    // Each floater drifts with the track at its own depth and wraps around just off screen.
    const x = useTransform(travel, (v) => {
        const drift = (v / window.innerWidth) * 100 * item.depth * 0.3
        return `${wrap(-15, 135, item.left + drift)}vw`
    })
    const Icon = item.kind === 'fish' ? FishIcon : StarIcon
    return (
        <motion.div
            aria-hidden
            className={`absolute ${item.size}`}
            style={{ top: item.top, left: 0, x, color: item.color }}
        >
            <Float amplitude={10} sway={item.kind === 'star' ? 20 : 6} duration={3 + (index % 3)} delay={index * 0.2}>
                <Icon className="w-full" />
            </Float>
        </motion.div>
    )
}

function NftCard({ item, index, clone }: { item: CollectionItem; index: number; clone: boolean }) {
    return (
        // The second copy only exists for the seamless loop, so screen readers and Tab skip it.
        <motion.li className="shrink-0" variants={card} custom={index} aria-hidden={clone || undefined}>
            {/* Width follows the viewport height too, so card + caption always fit on short screens. */}
            <PalCard className="group w-[min(62vw,40svh)] rounded-2xl sm:w-[clamp(180px,min(30vw,40svh),320px)]">
                <a
                    href="#"
                    onClick={(event) => event.preventDefault()}
                    draggable={false}
                    tabIndex={clone ? -1 : undefined}
                    className="block rounded-2xl border-[6px] border-white bg-white shadow-[0_0_0_4px_#4cc9f0,0_24px_60px_-20px_rgb(0_0_0/0.6)] transition-shadow duration-300 group-hover:shadow-[0_0_0_4px_#ff8fc7,0_30px_80px_-18px_rgb(255_143_199/0.55)] focus-visible:outline-offset-8"
                    aria-label={`${item.name}, Fluffy PALS #${item.id}, ${item.rarity}`}
                >
                    <div
                        className="relative flex aspect-[4/5] items-end justify-center overflow-hidden rounded-lg"
                        style={{ background: `linear-gradient(160deg, ${item.bg[0]}, ${item.bg[1]})` }}
                    >
                        <span className="absolute top-3 left-3 rounded-full bg-white/70 px-2.5 py-1 font-display text-[11px] font-semibold tracking-wider text-navy">
                            #{String(item.id).padStart(4, '0')}
                        </span>
                        <div className="mb-[-6%] w-[78%] transition-transform duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] group-hover:-translate-y-2 group-hover:scale-105 group-hover:rotate-[-3deg]">
                            <Critter
                                species={item.species}
                                body={item.body}
                                accent={item.accent}
                                accessory={item.accessory}
                                className="w-full"
                            />
                        </div>
                    </div>
                </a>
            </PalCard>
            <div className="mt-4 flex items-center justify-between gap-3 px-1">
                <p className="font-display text-lg font-semibold text-white">
                    {item.name}
                    <span className="block font-sans text-xs font-bold tracking-widest text-white/50">
                        FLUFFY PALS #{item.id}
                    </span>
                </p>
                <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold tracking-wider uppercase ${RARITY_TONE[item.rarity]}`}
                >
                    {item.rarity}
                </span>
            </div>
        </motion.li>
    )
}


export function Collection() {
    const { page, position } = useStage()
    const listRef = useRef<HTMLUListElement>(null)
    const { x, travel, handlers } = useMarquee(listRef, COLLECTION.length, page === 3)
    const roomX = useTransform(position, [2, 3], ['100vw', '0vw'])

    const [mounted, setMounted] = useState(false)
    if (page >= 2 && !mounted) setMounted(true)

    return (
        <Scene index={3} label="The collection">
            <motion.div
                className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,#2a2a8f_0%,#0d1145_60%)]"
                style={{ x: roomX }}
            >
                {/* ceiling waves */}
                <svg
                    aria-hidden
                    viewBox="0 0 1440 220"
                    preserveAspectRatio="none"
                    className="absolute inset-x-0 top-0 h-[22%] w-full"
                >
                    <path d="M0 0 H1440 V120 C1180 190 980 60 720 120 C460 180 260 70 0 140 Z" fill="#5b2bb5" opacity="0.8" />
                    <path d="M0 0 H1440 V70 C1200 130 1000 30 760 80 C520 130 300 40 0 90 Z" fill="#ff5f8f" opacity="0.85" />
                </svg>
                {/* floor with a perspective grid */}
                <div aria-hidden className="absolute inset-x-[-20%] bottom-[-38%] h-[46%] [perspective:600px]">
                    <div className="h-full w-full origin-top [transform:rotateX(62deg)] bg-[#f6f7fb] bg-[linear-gradient(#e9ecf5_2px,transparent_2px),linear-gradient(90deg,#e9ecf5_2px,transparent_2px)] bg-[size:80px_80px] opacity-90" />
                </div>

                {FLOATERS.slice(0, FLOATERS.length).map((item, i) => (
                    <Floater key={i} item={item} index={i} travel={travel} />
                ))}

                <div className="relative flex h-full flex-col pt-[clamp(6rem,14svh,9rem)] pb-[clamp(5.5rem,12svh,7rem)]">
                    <div className="flex items-end justify-between gap-4 px-6 sm:px-10">
                        <div>
                            <p className="font-display text-xs font-semibold tracking-[0.35em] text-white/60 uppercase">Gallery</p>
                            <SplitText
                                text="The Collection"
                                show={page === 3}
                                delay={0.3}
                                className="font-display text-[clamp(2.2rem,5vw,4.2rem)] leading-none font-bold text-white"
                            />
                        </div>
                        <p className="hidden font-display text-sm font-semibold tracking-[0.2em] text-white/60 uppercase sm:block">
                            ← drag →
                        </p>
                    </div>

                    <div className="flex min-h-0 flex-1 cursor-grab items-center active:cursor-grabbing">
                        {mounted && (
                            <motion.ul
                                ref={listRef}
                                className="flex w-max touch-pan-y gap-6 px-6 select-none sm:gap-[clamp(1.5rem,4vw,4rem)] sm:px-10"
                                style={{ x }}
                                {...handlers}
                                variants={track}
                                initial="hidden"
                                animate={page === 3 ? 'shown' : 'hidden'}
                            >
                                {[...COLLECTION, ...COLLECTION].map((item, i) => (
                                    <NftCard key={i} item={item} index={i} clone={i >= COLLECTION.length} />
                                ))}
                            </motion.ul>
                        )}
                    </div>
                </div>
            </motion.div>
        </Scene>
    )
}
