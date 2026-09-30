import { motion, useTransform } from 'framer-motion'
import { Critter } from '../art/Critter'
import { PALS, type Pal } from '@/data/pals'
import { Float } from '../motion/Float'
import { WaveText } from '../motion/WaveText'

import { Scene } from '@/stage/Scence'
import { useStage } from '../stage/stage'

// friend flying around the mascot
const FRIENDS = [
    { from: [-70, -40], to: [2, -26], spin: -140, size: 'w-[clamp(60px,12vmin,130px)]' },
    { from: [70, -45], to: [34, -32], spin: 120, size: 'w-[clamp(56px,11vmin,120px)]' },
    { from: [-75, 30], to: [0, 30], spin: -90, size: 'w-[clamp(64px,13vmin,140px)]' },
    { from: [75, 35], to: [40, 22], spin: 100, size: 'w-[clamp(60px,12vmin,128px)]' },
    { from: [-20, 80], to: [22, 38], spin: -60, size: 'w-[clamp(46px,9vmin,92px)]' },
    { from: [80, -5], to: [43, -6], spin: 45, size: 'w-[clamp(44px,8vmin,88px)]' },
]

function Friend({ friend, pal, index }: { friend: (typeof FRIENDS)[number]; pal: Pal; index: number }) {
    const { position } = useStage()
    const to = friend.to
    const arrive = 0.25 + index * 0.06

    // Arrive from the edges (pages 1 → 2), then rush outward as the camera zooms in (pages 2 → 3).
    const frames = [arrive, 1, 1.8]
    const x = useTransform(position, frames, [`${friend.from[0]}vw`, `${to[0]}vw`, `${to[0] * 3}vw`])
    const y = useTransform(position, frames, [`${friend.from[1]}vh`, `${to[1]}vh`, `${to[1] * 3}vh`])
    const rotate = useTransform(position, frames, [friend.spin, friend.spin / 10, 0])
    const scale = useTransform(position, frames, [0.4, 1, 2.2])

    return (
        // Zero-size anchor at the centre; the motion transform moves it, the inner div centres the art.
        <motion.div className="absolute top-1/2 left-1/2" style={{ x, y, rotate, scale }}>
            <div className={`-translate-x-1/2 -translate-y-1/2 ${friend.size}`}>
                <Float amplitude={8} sway={6} duration={3.2 + (index % 3)} delay={index * 0.3}>
                    <Critter {...pal} className="w-full drop-shadow-[0_8px_0_rgb(34_49_143/0.12)]" />
                </Float>
            </div>
        </motion.div>
    )
}


export function Story() {
    const { page, position } = useStage()
    const hillY = useTransform(position, [0.3, 1, 1.7], ['100%', '0%', '100%'])
    const friends = FRIENDS.slice(0, FRIENDS.length)

    return (
        <Scene index={1} label="Our story">
            <motion.svg
                aria-hidden
                viewBox="0 0 1440 600"
                preserveAspectRatio="none"
                className="absolute inset-x-0 bottom-0 h-[45%] w-full"
                style={{ y: hillY }}
            >
                <path d="M0 260 C 360 40, 1080 40, 1440 260 L1440 600 L0 600 Z" fill="#fff6ea" />
                <path
                    d="M0 330 C 420 150, 1020 150, 1440 330"
                    fill="none"
                    stroke="#ffd27a"
                    strokeWidth="6"
                    strokeDasharray="2 18"
                    strokeLinecap="round"
                />
            </motion.svg>

            {friends.map((friend, i) => (
                <Friend key={i} friend={friend} pal={PALS[i]!} index={i} />
            ))}

            <div className="absolute inset-x-6 top-[14%] text-center sm:top-1/2 sm:left-[6%] sm:max-w-[46vw] sm:-translate-y-1/2 sm:text-left">
                <WaveText
                    show={page === 1}
                    lines={['For everyone who dreams', 'of living surrounded', 'by soft, happy animals.']}
                    className="text-[clamp(1.5rem,3.4vw,3rem)] leading-[1.25] tracking-[0.06em] text-navy"
                />
                <WaveText
                    show={page === 1}
                    delay={1.6}
                    lines={['Carry your favourite friend with you,', 'and show the world a little more of yourself.']}
                    className="mt-5 text-[clamp(0.85rem,1.3vw,1.1rem)] leading-loose tracking-[0.18em] text-navy/85"
                />
            </div>
        </Scene>
    )
}
