import { motion, type Variants } from 'framer-motion'
import { cn } from '../lib/cn'


const REVEAL_TIME = 2.2 // seconds for the whole text to type in, whatever its length

const block: Variants = {
  hidden: { opacity: 0, transition: { duration: 0.8 } },
  // Stagger and delay live in the variant: a variant's own `transition` replaces the component's `transition` prop.
  shown: ({ stagger, delay }: { stagger: number; delay: number }) => ({
    opacity: 1,
    transition: { duration: 0.01, staggerChildren: stagger, delayChildren: delay },
  }),
}
const char: Variants = {
  // Reset only after the block has faded out, so leaving is one soft fade (not the typing in reverse).
  hidden: { opacity: 0, y: 20, transition: { delay: 0.8, duration: 0 } },
  shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.33, 1, 0.68, 1] } },
}

/**
 * The reference's scene copy: when `show` turns on, characters fade and rise in one after
 * another, then keep bobbing in a slow wave (a CSS loop offset per character, so it costs
 * no JavaScript, and only runs while shown). Screen readers get the plain lines; the
 * animated letters are aria-hidden.
 */
export function WaveText({
  lines,
  show,
  delay = 0.5,
  className,
}: {
  lines: string[]
  show: boolean
  /** Beat before typing starts, so the scene transition lands first. */
  delay?: number
  className?: string
}) {
  const total = lines.join('').length
  let index = 0

  return (
    <motion.p
      className={cn('text-outline font-display font-bold', className)}
      variants={block}
      custom={{ stagger: REVEAL_TIME / total, delay }}
      initial="hidden"
      animate={show ? 'shown' : 'hidden'}
    >
      <span className="sr-only">{lines.join(' ')}</span>
      {lines.map((line, l) => (
        <span key={l} aria-hidden className="block">
          {line.split(' ').map((word, w) => (
            <span key={w} className="inline-block whitespace-nowrap">
              {Array.from(word).map((letter) => {
                const i = index++
                return (
                  <motion.span key={i} variants={char} className="inline-block">
                    <span
                      className={'wave-char'}
                      style={{ animationDelay: `${-i * 0.36}s` }}
                    >
                      {letter}
                    </span>
                  </motion.span>
                )
              })}
              <span className="inline-block">&nbsp;</span>
            </span>
          ))}
        </span>
      ))}
    </motion.p>
  )
}
