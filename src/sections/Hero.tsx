
import { Float } from "@/motion/Float";
import { pointer } from "@/motion/pointer";
import { Scene } from "@/stage/Scence"
import { useStage } from "@/stage/stage";
import { motion, useSpring, useTransform } from 'motion/react'
import { Blob } from "@/art/Blob";
import { useIntro } from "@/motion/intro";
const TITLE = ['Fluffy', 'PALS']
const BLOBS = [
  {
    seed: 40,
    from: '#ffc2a8',
    to: '#ffb3c7',
    className: 'left-[30%] top-[-6%] w-[clamp(160px,18vw,300px)]',
    depth: 0.9,
  },
  {
    seed: 32,
    from: '#b8ecff',
    to: '#c9b8ff',
    className: 'left-[4%] top-[48%] w-[clamp(150px,16vw,260px)]',
    depth: 0.6,
  },
  {
    seed: 7,
    from: '#b8ecff',
    to: '#d4c6ff',
    className: 'right-[12%] top-[46%] w-[clamp(160px,17vw,280px)]',
    depth: 1.1,
  },
  {
    seed: 19,
    from: '#ffd0b8',
    to: '#ffb0c8',
    className: 'left-[38%] bottom-[-10%] w-[clamp(140px,14vw,240px)]',
    depth: 0.7,
  },
  {
    seed: 23,
    from: '#d4c6ff',
    to: '#b8ecff',
    className: 'left-[-3%] top-[-4%] w-[clamp(100px,9vw,160px)]',
    depth: 1.3,
  },
]

function ParallaxBlob({ blob, index }: { blob: (typeof BLOBS)[number]; index: number }) {
  // const { lite } = useTier()
  const { ready } = useIntro()
  const { position } = useStage()
  const { x: px, y: py } = pointer()
  // Leaving the page: deeper blobs float up faster (layered parallax).
  const y = useTransform(position, [0, 1], ['0vh', `${-blob.depth * 70}vh`])
  // Pointer parallax, spring-smoothed. Off in the lite tier.
  const mx = useSpring(useTransform(px, [-1, 1], [-blob.depth * 30, blob.depth * 30]), { stiffness: 60, damping: 20 })
  const my = useSpring(useTransform(py, [-1, 1], [-blob.depth * 20, blob.depth * 20]), { stiffness: 60, damping: 20 })

  return (
    <motion.div className={`absolute ${blob.className}`} style={{ y }}>
      <motion.div style={{ x: mx, y: my }}>
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={ready ? { scale: 1, rotate: 0 } : undefined}
          transition={{ type: 'spring', stiffness: 90, damping: 14, delay: 0.25 + index * 0.08 }}
        >
          <Float amplitude={14} sway={8} duration={6 + index} delay={index * 0.4}>
            <Blob seed={blob.seed} from={blob.from} to={blob.to} className="w-full opacity-90" />
          </Float>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

function TitleLetter({ char, index }: { char: string; index: number }) {

  const { position } = useStage()
  const { ready } = useIntro()
  // Leaving the page, each letter drifts up at its own speed and tilts: the title "breaks apart".
  const distance = 30 + ((index * 37) % 5) * 12
  const y = useTransform(position, [0, 0.8], ['0vh', `${-distance}vh`])
  const rotate = useTransform(position, [0, 0.8], [0, (index % 2 ? 1 : -1) * (8 + (index % 4) * 5)])
  const opacity = useTransform(position, [0.3, 0.7], [1, 0])

  return (
    <motion.span className="inline-block" style={{ y, rotate, opacity }}>
      <motion.span
        className="inline-block"
        initial={{ y: '115%', opacity: 0, rotate: 12 }}
        animate={ready ? { y: '0%', opacity: 1, rotate: 0 } : undefined}
        transition={{ type: 'spring', stiffness: 240, damping: 16, delay: 0.35 + index * 0.05 }}
      >
        {char}
      </motion.span>
    </motion.span>
  )
}

export function Hero() {

  let letterIndex = 0

  return (
    <Scene index={0} label="Fluffy PALS">
      {BLOBS.slice(0, BLOBS.length).map((blob, i) => (
        <ParallaxBlob key={blob.seed} blob={blob} index={i} />
      ))}

      <h1
        aria-label="Fluffy PALS"
        className="absolute inset-x-0 top-[20%] text-center font-display text-[clamp(4.2rem,23vw,15rem)] leading-[0.85] font-bold tracking-tight text-navy sm:top-[24%] sm:text-[clamp(4.2rem,17vw,15rem)]"
      >
        {TITLE.map((word) => (
          <span key={word} aria-hidden className="mx-[0.12em] inline-block whitespace-nowrap max-sm:block">
            {Array.from(word).map((char) => (
              <TitleLetter key={letterIndex} char={char} index={letterIndex++} />
            ))}
          </span>
        ))}
      </h1>
    </Scene>
  )
}
