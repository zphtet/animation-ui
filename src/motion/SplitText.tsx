import { motion, type Variants } from 'framer-motion'

const container: Variants = {
    hidden: {},
    shown: ({ stagger, delay }: { stagger: number; delay: number }) => ({
        transition: { staggerChildren: stagger, delayChildren: delay },
    }),
}
const letter: Variants = {
    hidden: { y: '110%', rotate: 8, opacity: 0 },
    shown: { y: '0%', rotate: 0, opacity: 1, transition: { type: 'spring', stiffness: 260, damping: 18 } },
}


export function SplitText({
    text,
    className,
    show,
    stagger = 0.035,
    delay = 0,
    as: Tag = 'h2',
    id,
}: {
    text: string
    id?: string
    className?: string
    /** Controlled trigger; omit to animate when scrolled into view. */
    show?: boolean
    stagger?: number
    delay?: number
    as?: 'h1' | 'h2' | 'h3' | 'p'
}) {
    const MotionTag = motion[Tag]
    const trigger =
        show === undefined
            ? { whileInView: 'shown', viewport: { once: true, amount: 0.6 } }
            : { animate: show ? 'shown' : 'hidden' }

    return (
        <MotionTag
            id={id}
            className={className}
            initial="hidden"
            variants={container}
            custom={{ stagger, delay }}
            aria-label={text}
            {...trigger}
        >
            {text.split(' ').map((word, w) => (
                <span key={w} aria-hidden className="inline-block whitespace-nowrap">
                    {Array.from(word).map((char, i) => (
                        <motion.span key={i} variants={letter} className="inline-block will-change-transform">
                            {char}
                        </motion.span>
                    ))}
                    {w < text.split(' ').length - 1 && <span className="inline-block">&nbsp;</span>}
                </span>
            ))}
        </MotionTag>
    )
}
