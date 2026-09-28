import { animate, motion, useMotionValue } from 'framer-motion'
import { useState } from 'react'
import { BirdIcon, BoatIcon, ChatIcon } from '@/art/icons'
import { blobPath } from '@/art/blobPath'
import { useIntro } from '@/motion/intro'
import { useStage } from '@/stage/stage'

const SOCIALS = [
    { label: 'Discord', icon: ChatIcon, color: 'bg-[#5865f2]' },
    { label: 'OpenSea', icon: BoatIcon, color: 'bg-[#2081e2]' },
    { label: 'X / Twitter', icon: BirdIcon, color: 'bg-[#1d9bf0]' },
]

// Two blobs with identical structure → Framer interpolates `d` for a smooth morph on hover.
const BLOB_REST = blobPath(5, { points: 7, variance: 0.3, radius: 86 })
const BLOB_HOVER = blobPath(41, { points: 7, variance: 0.42, radius: 92 })
const EASE = [0.65, 0, 0.35, 1] as const

/** Top-left logo. Hidden on the first page, where the giant title is the logo; white in the dark gallery. */
function Logo({ hidden = true, light }: { hidden: boolean; light: boolean }) {
    const { goTo } = useStage()
    return (
        <motion.a
            href="#"
            onClick={(event) => {
                event.preventDefault()
                goTo(0)
            }}
            tabIndex={hidden ? -1 : undefined}
            animate={{ opacity: hidden ? 0 : 1, y: hidden ? -12 : 0 }}
            transition={{ duration: 0.5 }}
            className={`group font-display text-[clamp(1.6rem,3vw,2.6rem)] leading-none font-bold tracking-tight transition-colors duration-500 ${hidden ? 'pointer-events-none' : 'pointer-events-auto'} ${light ? 'text-white' : 'text-navy'}`}
            aria-label="Fluffy PALS, back to the first page"
        >
            <span className="inline-block transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
                Fluffy
            </span>{' '}
            <span className="inline-block transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105">
                PALS
            </span>
        </motion.a>
    )
}

function Socials() {
    return (
        <ul className="pointer-events-auto flex gap-2.5 sm:gap-4">
            {SOCIALS.map(({ label, icon: Icon, color }, i) => (
                <motion.li
                    key={label}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9 + i * 0.08, type: 'spring', stiffness: 200, damping: 16 }}
                >
                    <motion.a
                        href="#"
                        onClick={(event) => event.preventDefault()}
                        aria-label={label}
                        className={`group relative flex size-9 items-center justify-center rounded-full text-white shadow-[0_4px_0_rgb(0_0_0/0.15)] sm:size-11 ${color}`}
                        whileHover={{ y: -4, rotate: -8, scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 14 }}
                    >
                        <Icon className="size-5" />
                        <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 translate-y-1 rounded-md bg-navy px-2 py-1 text-[11px] font-bold whitespace-nowrap text-white opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                            {label}
                        </span>
                    </motion.a>
                </motion.li>
            ))}
        </ul>
    )
}

/** Right-edge page dots: shows where you are and jumps to any page. */
function Pager({ pages, light }: { pages: string[]; light: boolean }) {
    const { page, goTo } = useStage()
    return (
        <ol className="pointer-events-auto flex flex-col items-end gap-3">
            {pages.map((name, i) => (
                <li key={name}>
                    <button
                        type="button"
                        onClick={() => goTo(i)}
                        aria-label={`Page ${i + 1}: ${name}`}
                        aria-current={page === i ? 'step' : undefined}
                        className="group flex items-center justify-end gap-2 py-1"
                    >
                        <span
                            className={`font-display text-xs font-semibold tracking-widest opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100 ${light ? 'text-white' : 'text-navy'} translate-x-1`}
                        >
                            {name}
                        </span>
                        <span
                            // The active dot stretches with scaleX (not width) so it never triggers layout.
                            className={`block h-2 w-6 origin-right rounded-full transition-[scale,opacity] duration-500 ${light ? 'bg-white' : 'bg-navy'} ${page === i ? '' : 'scale-x-[0.34] opacity-40 group-hover:opacity-80'}`}
                        />
                    </button>
                </li>
            ))}
        </ol>
    )
}

/**
 * The reference's signature bottom-right blob button. Hover morphs its outline. Clicking it
 * grows the blob until it covers the screen, jumps to the gallery underneath, then shrinks
 * back to reveal it. On the gallery page it becomes "back to top".
 */
function CollectionBlobButton() {
    const { page, count, goTo } = useStage()
    const [hover, setHover] = useState(false)
    const [covering, setCovering] = useState(false)
    const cover = useMotionValue(1)
    const onGallery = page === count - 1

    async function openGallery() {
        setCovering(true)
        await animate(cover, 22, { duration: 0.7, ease: EASE })
        goTo(count - 1, { instant: true })
        await animate(cover, 1, { duration: 0.8, delay: 0.15, ease: EASE })
        setCovering(false)
    }

    return (
        <motion.button
            type="button"
            onClick={() => (onGallery ? goTo(0) : openGallery())}
            disabled={covering}
            onHoverStart={() => setHover(true)}
            onHoverEnd={() => setHover(false)}
            onFocus={() => setHover(true)}
            onBlur={() => setHover(false)}
            className="pointer-events-auto relative flex size-[clamp(128px,19vw,240px)] translate-x-[18%] translate-y-[20%] items-center justify-center"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 1, type: 'spring', stiffness: 120, damping: 14 }}
            whileTap={{ scale: 0.94 }}
        >
            <svg viewBox="0 0 200 200" className="absolute inset-0 size-full overflow-visible" aria-hidden>
                <motion.g style={{ scale: cover, originX: '50%', originY: '50%' }}>
                    <motion.path
                        fill="#22318f"
                        initial={false}
                        animate={{ d: hover ? BLOB_HOVER : BLOB_REST, rotate: hover ? 12 : 0, scale: hover ? 1.06 : 1 }}
                        transition={{ type: 'spring', stiffness: 120, damping: 14 }}
                        style={{ originX: '50%', originY: '50%' }}
                    />
                </motion.g>
            </svg>
            <motion.span
                className="relative -translate-x-[15%] -translate-y-[17%] text-center font-display text-xs leading-tight font-semibold text-white sm:text-[13px] lg:text-sm"
                animate={{ letterSpacing: hover ? '0.32em' : '0.18em', opacity: covering ? 0 : 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
                {onGallery ? (
                    <>
                        back <br className="lg:hidden" />
                        to top
                    </>
                ) : (
                    <>
                        view <br className="lg:hidden" />
                        collection
                    </>
                )}
            </motion.span>
        </motion.button>
    )
}

/** Fixed UI that stays on every page, like the reference (logo, socials, page dots, CTA blob). */
export function FixedItems({ pages }: { pages: string[] }) {
    const { ready } = useIntro()
    const { page, count } = useStage()
    if (!ready) return null
    const light = page === count - 1

    return (
        <>
            <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between px-6 pt-6 sm:px-10 sm:pt-8">
                <Logo hidden={page === 0} light={light} />
            </header>
            {/* Phones navigate by swiping; the dots would crowd the content there. */}
            <nav
                aria-label="Pages"
                className="pointer-events-none fixed top-1/2 right-6 z-40 hidden -translate-y-1/2 sm:block"
            >
                <Pager pages={pages} light={light} />
            </nav>
            <nav aria-label="Social links" className="pointer-events-none fixed bottom-6 left-6 z-40 sm:bottom-8 sm:left-10">
                <Socials />
            </nav>
            <div className="pointer-events-none fixed right-0 bottom-0 z-50">
                <CollectionBlobButton />
            </div>
        </>
    )
}
