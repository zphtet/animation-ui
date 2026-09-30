import { motion, useTransform } from 'framer-motion'
import { Critter } from '../art/Critter'
import { Float } from '../motion/Float'
import { useIntro } from '../motion/intro'
import { useStage } from '../stage/stage'

export function Mascot() {
    const { ready } = useIntro()
    const { position } = useStage()
    const rotate = useTransform(position, [0, 1], [-90, 0])
    const x = useTransform(position, [0, 1], ['0vw', '18vw'])
    const y = useTransform(position, [0, 1], ['0vh', '2vh'])
    const scale = useTransform(position, [0, 1, 1.8], [1, 1.3, 5])
    const opacity = useTransform(position, [1.35, 1.75], [1, 0])
    const visibility = useTransform(position, (p) => (p < 1.8 ? 'visible' : 'hidden'))

    return (
        // Entrance (outer) is kept outside the rotation (inner), so it rises from below whatever the pose.
        <motion.div
            aria-hidden
            className="pointer-events-none absolute z-1000 top-[54%] left-1/2 w-[clamp(170px,min(50vw,27svh),380px)] -translate-x-1/2 -translate-y-1/2 sm:top-[60%] sm:w-[clamp(170px,30vmin,380px)]"
            style={{ visibility }}
            initial={{ y: '70vh', opacity: 0 }}
            animate={ready ? { y: 0, opacity: 1 } : undefined}
            transition={{ type: 'spring', stiffness: 50, damping: 14, delay: 0.5 }}
        >
            <motion.div style={{ x, y, rotate, scale, opacity }}>
                <Float amplitude={12} sway={2} duration={4.5}>
                    <Critter species="cat" accessory="headphones" className="w-full drop-shadow-[0_14px_0_rgb(34_49_143/0.1)]" />
                </Float>
            </motion.div>
        </motion.div>
    )
}
