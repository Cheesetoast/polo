import {
  forwardRef,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react"

export type HomepageEntrancePhase = "hold" | "play" | "done"

const DURATION_MS = 550

export type HomepageEntranceRevealProps = {
  phase: HomepageEntrancePhase
  /** Stagger after the reveal sequence starts (ms). */
  delayMs: number
  children: ReactNode
  className?: string
}

/**
 * Imperative fade/slide-in via Web Animations API — avoids styled-components / CSS animation
 * issues where keyframes or transitions never run on dynamic class changes.
 */
export const HomepageEntranceReveal = forwardRef<
  HTMLDivElement,
  HomepageEntranceRevealProps
>(function HomepageEntranceReveal(
  { phase, delayMs, children, className },
  forwardedRef
) {
  const innerRef = useRef<HTMLDivElement | null>(null)
  const animationRef = useRef<Animation | null>(null)

  const setRefs = (node: HTMLDivElement | null) => {
    innerRef.current = node
    if (typeof forwardedRef === "function") forwardedRef(node)
    else if (forwardedRef) forwardedRef.current = node
  }

  useLayoutEffect(() => {
    const el = innerRef.current
    if (!el) return

    const reduced =
      typeof window.matchMedia !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const finish = () => {
      animationRef.current?.cancel()
      animationRef.current = null
      el.style.opacity = "1"
      el.style.transform = "none"
      el.style.pointerEvents = "auto"
    }

    const hide = () => {
      animationRef.current?.cancel()
      animationRef.current = null
      el.style.opacity = "0"
      el.style.transform = "translate3d(0, 20px, 0)"
      el.style.pointerEvents = "none"
    }

    if (reduced) {
      finish()
      return
    }

    if (phase === "done") {
      finish()
      return
    }

    if (phase === "hold") {
      hide()
      return
    }

    // phase === "play" — reset start pose every time (covers React Strict Mode re-running the effect).
    if (typeof el.animate !== "function") {
      finish()
      return
    }

    hide()
    const anim = el.animate(
      [
        { opacity: 0, transform: "translate3d(0, 20px, 0)" },
        { opacity: 1, transform: "translate3d(0, 0, 0)" },
      ],
      {
        duration: DURATION_MS,
        delay: delayMs,
        easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        fill: "forwards",
      }
    )
    animationRef.current = anim
    el.style.pointerEvents = "auto"
    return () => {
      anim.cancel()
    }
  }, [phase, delayMs])

  return (
    <div
      ref={setRefs}
      className={className}
      style={{ minWidth: 0 }}
    >
      {children}
    </div>
  )
})
