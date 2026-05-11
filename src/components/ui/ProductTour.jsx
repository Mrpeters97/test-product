import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTour } from '../../context/TourContext'
import { TOUR_STEPS } from '../../constants/tourSteps'

const Spotlight = ({ targetRect, padding, borderRadius = 6 }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!targetRect) {
      setIsVisible(false)
      return
    }
    setIsVisible(true)
  }, [targetRect])

  if (!targetRect) return null

  const x = Math.max(0, targetRect.left - padding)
  const y = Math.max(0, targetRect.top - padding)
  const w = targetRect.width + padding * 2
  const h = targetRect.height + padding * 2
  const vw = window.innerWidth
  const vh = window.innerHeight
  // Clamp border radius to half of the smallest dimension
  const radius = Math.min(borderRadius, w / 2, h / 2)

  const cutout = `
    M 0,0 L ${vw},0 L ${vw},${vh} L 0,${vh} Z
    M ${x + radius},${y}
    L ${x + w - radius},${y}
    Q ${x + w},${y} ${x + w},${y + radius}
    L ${x + w},${y + h - radius}
    Q ${x + w},${y + h} ${x + w - radius},${y + h}
    L ${x + radius},${y + h}
    Q ${x},${y + h} ${x},${y + h - radius}
    L ${x},${y + radius}
    Q ${x},${y} ${x + radius},${y}
    Z
  `

  return (
    <svg
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 99998,
        pointerEvents: 'none',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <path fill="rgba(14, 14, 14, 0.32)" fillRule="evenodd" d={cutout} />
      <path fill="rgba(0, 67, 184, 0.08)" fillRule="evenodd" d={cutout} />
    </svg>
  )
}

const TourCard = ({ title, description, currentStep, totalSteps, onNext, onPrev, onClose, targetRect, dialogSide }) => {
  const cardRef = useRef(null)
  const isLastStep = currentStep === totalSteps - 1
  const [position, setPosition] = useState(null)
  const [dontShowAgain, setDontShowAgain] = useState(false)

  useLayoutEffect(() => {
    if (!cardRef.current) return

    const cardRect = cardRef.current.getBoundingClientRect()
    const gap = 24
    const padding = 16
    const vw = window.innerWidth
    const vh = window.innerHeight

    const calculatePosition = (side) => {
      let top, left
      switch (side) {
        case 'bottom':
          top = targetRect.bottom + gap
          left = targetRect.left + targetRect.width / 2 - cardRect.width / 2
          break
        case 'top':
          top = targetRect.top - gap - cardRect.height
          left = targetRect.left + targetRect.width / 2 - cardRect.width / 2
          break
        case 'right':
          top = targetRect.top + targetRect.height / 2 - cardRect.height / 2
          left = targetRect.right + gap
          break
        case 'left':
          top = targetRect.top + targetRect.height / 2 - cardRect.height / 2
          left = targetRect.left - gap - cardRect.width
          break
        default:
          top = targetRect.bottom + gap
          left = targetRect.left + targetRect.width / 2 - cardRect.width / 2
      }
      top = Math.max(padding, Math.min(top, vh - cardRect.height - padding))
      left = Math.max(padding, Math.min(left, vw - cardRect.width - padding))
      return { top, left }
    }

    const checkOverlap = (pos) => {
      const cardBox = {
        left: pos.left,
        right: pos.left + cardRect.width,
        top: pos.top,
        bottom: pos.top + cardRect.height,
      }
      const spotlightBox = {
        left: targetRect.left - 8,
        right: targetRect.right + 8,
        top: targetRect.top - 8,
        bottom: targetRect.bottom + 8,
      }
      return !(cardBox.right < spotlightBox.left ||
        cardBox.left > spotlightBox.right ||
        cardBox.bottom < spotlightBox.top ||
        cardBox.top > spotlightBox.bottom)
    }

    let finalPosition
    if (targetRect) {
      // Prioritize dialogSide if specified
      const positionOrder = dialogSide === 'left' ? ['left', 'bottom', 'top', 'right'] :
                           dialogSide === 'right' ? ['right', 'bottom', 'top', 'left'] :
                           dialogSide === 'top' ? ['top', 'bottom', 'left', 'right'] :
                           ['bottom', 'top', 'right', 'left']
      const positions = positionOrder.map(side => ({
        side,
        pos: calculatePosition(side),
        overlap: checkOverlap(calculatePosition(side))
      }))

      const noOverlapPositions = positions.filter(p => !p.overlap)
      if (noOverlapPositions.length > 0) {
        finalPosition = noOverlapPositions[0].pos
      } else {
        finalPosition = positions[0].pos
      }
    } else {
      const pos = {
        top: vh / 2 - cardRect.height / 2,
        left: vw / 2 - cardRect.width / 2,
      }
      finalPosition = pos
    }

    setPosition(finalPosition)
  }, [targetRect, dialogSide])

  const handleCheckboxChange = (e) => {
    setDontShowAgain(e.target.checked)
  }

  return (
    <div
      ref={cardRef}
      style={{
        position: 'fixed',
        top: position ? `${position.top}px` : '50%',
        left: position ? `${position.left}px` : '50%',
        transform: position ? 'none' : 'translate(-50%, -50%)',
        display: 'flex',
        width: '500px',
        maxWidth: 'var(--max-width-max-w-xl, 576px)',
        padding: 'var(--Gap-6, 24px)',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '0',
        borderRadius: 'var(--border-radius-lg, 8px)',
        background: 'var(--base-background, #FFF)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        zIndex: 99999,
        pointerEvents: 'auto',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: position ? 1 : 0,
      }}
    >
      {/* Top Section - Stepper on right */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--Gap-4, 16px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--Gap-1, 4px)' }}>
            {Array.from({ length: totalSteps }).map((_, i) => {
              let style
              if (i === currentStep) {
                // Active step
                style = {
                  width: 'var(--width-w-5, 20px)',
                  height: '8px',
                  backgroundColor: 'var(--base-foreground, #18181B)',
                  borderRadius: 'var(--border-radius-md, 6px)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }
              } else if (i < currentStep) {
                // Past steps (completed)
                style = {
                  width: 'var(--width-w-2, 8px)',
                  height: '8px',
                  backgroundColor: 'var(--base-muted-foreground, #71717A)',
                  borderRadius: 'var(--border-radius-md, 6px)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }
              } else {
                // Upcoming steps
                style = {
                  width: 'var(--width-w-2, 8px)',
                  height: '8px',
                  backgroundColor: 'var(--base-border, #E4E4E7)',
                  borderRadius: 'var(--border-radius-md, 6px)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }
              }
              return <div key={i} style={style} />
            })}
          </div>
          <span
            style={{
              display: 'flex',
              padding: 'var(--Gap-1, 4px) var(--Gap-2, 8px)',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '4px',
              background: 'var(--base-accent, #F4F4F5)',
              fontSize: '12px',
              color: 'var(--base-foreground, #18181B)',
              fontWeight: '500',
            }}
          >
            {currentStep + 1}/{totalSteps}
          </span>
        </div>
      </div>

      {/* Middle Section - Title and Description */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 'var(--Gap-0-5, 2px)',
        alignSelf: 'stretch',
        width: '100%',
        marginTop: '0',
      }}>
        <h3 style={{
          color: 'var(--base-foreground, #18181B)',
          fontFamily: 'var(--typography-font-family-font-sans, Inter)',
          fontSize: 'var(--typography-base-sizes-large-font-size, 18px)',
          fontStyle: 'normal',
          fontWeight: 'var(--font-weight-semibold, 600)',
          lineHeight: 'var(--typography-base-sizes-large-line-height, 28px)',
          margin: 0,
        }}>
          {title}
        </h3>
        <p style={{
          color: 'var(--base-muted-foreground, #71717A)',
          fontFamily: 'var(--typography-font-family-font-sans, Inter)',
          fontSize: 'var(--typography-base-sizes-small-font-size, 14px)',
          fontStyle: 'normal',
          fontWeight: 'var(--font-weight-normal, 400)',
          lineHeight: 'var(--typography-base-sizes-small-line-height, 20px)',
          margin: 0,
        }}>
          {description}
        </p>
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        gap: 'var(--Gap-4, 16px)',
        marginTop: 'var(--Gap-4, 16px)',
      }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            onChange={handleCheckboxChange}
            checked={dontShowAgain}
            style={{ width: '14px', height: '14px', cursor: 'pointer' }}
          />
          <span style={{
            color: 'var(--base-muted-foreground, #71717A)',
            fontFamily: 'var(--typography-font-family-font-sans, Inter)',
            fontSize: 'var(--typography-base-sizes-small-font-size, 14px)',
            fontStyle: 'normal',
            fontWeight: 'var(--font-weight-normal, 400)',
            lineHeight: 'var(--typography-base-sizes-small-line-height, 20px)',
          }}>Don't show this again</span>
        </label>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
          {!dontShowAgain && (
            <button
              onClick={onPrev}
              disabled={currentStep === 0}
              style={{
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 500,
                borderRadius: 'var(--border-radius-md, 6px)',
                border: '1px solid var(--base-border, #E4E4E7)',
                backgroundColor: 'var(--base-background, #FFF)',
                color: 'var(--base-foreground, #18181B)',
                cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                opacity: currentStep === 0 ? 0.5 : 1,
              }}
            >
              Previous
            </button>
          )}
          <button
            onClick={dontShowAgain ? onClose : (isLastStep ? onClose : onNext)}
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 500,
              borderRadius: 'var(--border-radius-md, 6px)',
              border: 'none',
              backgroundColor: 'var(--base-foreground, #18181B)',
              color: '#ffffff',
              cursor: 'pointer',
            }}
          >
            {dontShowAgain ? 'Close' : (isLastStep ? 'Close' : 'Next')}
          </button>
        </div>
      </div>
    </div>
  )
}

const Backdrop = () => (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99997,
      pointerEvents: 'auto',
    }}
    onClick={(e) => e.stopPropagation()}
  />
)

export default function ProductTour() {
  const { isActive, currentStep, totalSteps, next, prev, end } = useTour()
  const [targetRect, setTargetRect] = useState(null)
  const [visibleTargetRect, setVisibleTargetRect] = useState(null)
  const resizeObserverRef = useRef(null)

  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isActive])

  useEffect(() => {
    setVisibleTargetRect(targetRect)
  }, [targetRect])

  useLayoutEffect(() => {
    if (!isActive) return

    const step = TOUR_STEPS[currentStep]
    if (!step) return

    const updateTargetRect = () => {
      // Special handling for variant-selector (include heading, filter, and selector)
      if (step.target === 'variant-selector') {
        const heading = document.querySelector('[data-tour="variant-selector-heading"]')
        const filter = document.querySelector('[data-tour="variant-selector-filter"]')
        const selector = document.querySelector('[data-tour="variant-selector"]')

        const elements = [heading, filter, selector].filter(Boolean)
        if (elements.length > 0) {
          let minLeft = Infinity
          let minTop = Infinity
          let maxRight = -Infinity
          let maxBottom = -Infinity

          elements.forEach(el => {
            const rect = el.getBoundingClientRect()
            minLeft = Math.min(minLeft, rect.left)
            minTop = Math.min(minTop, rect.top)
            maxRight = Math.max(maxRight, rect.right)
            maxBottom = Math.max(maxBottom, rect.bottom)
          })

          setTargetRect({
            left: minLeft,
            top: minTop,
            right: maxRight,
            bottom: maxBottom,
            width: maxRight - minLeft,
            height: maxBottom - minTop,
          })
        } else {
          setTargetRect(null)
        }
      }
      // Special handling for attribute-badge (first V-C-L badge)
      else if (step.target === 'attribute-badge') {
        const allBadges = Array.from(document.querySelectorAll('[data-tour="attribute-badge"]'))
        const vclBadge = allBadges.find(badge => badge.textContent.includes('V-C-L'))

        if (vclBadge) {
          const rect = vclBadge.getBoundingClientRect()
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            width: rect.width,
            height: rect.height,
          })
        } else {
          setTargetRect(null)
        }
      } else {
        const target = document.querySelector(`[data-tour="${step.target}"]`)
        if (target) {
          setTargetRect(target.getBoundingClientRect())
        } else {
          setTargetRect(null)
        }
      }
    }

    updateTargetRect()

    const target = document.querySelector(`[data-tour="${step.target}"]`)
    if (target) {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
      resizeObserverRef.current = new ResizeObserver(updateTargetRect)
      resizeObserverRef.current.observe(target)
    }

    window.addEventListener('resize', updateTargetRect)
    window.addEventListener('scroll', updateTargetRect)

    return () => {
      window.removeEventListener('resize', updateTargetRect)
      window.removeEventListener('scroll', updateTargetRect)
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
    }
  }, [isActive, currentStep])

  useEffect(() => {
    if (!isActive) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') end()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isActive, next, prev, end])

  if (!isActive) return null

  const step = TOUR_STEPS[currentStep]
  if (!step) return null

  return createPortal(
    <>
      <Backdrop />
      {visibleTargetRect
        ? <Spotlight targetRect={visibleTargetRect} padding={step.spotlightPadding} borderRadius={step.borderRadius} />
        : <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(14, 14, 14, 0.32)', zIndex: 99998, pointerEvents: 'none' }} />
      }
      <TourCard
        title={step.title}
        description={step.description}
        currentStep={currentStep}
        totalSteps={totalSteps}
        onNext={next}
        onPrev={prev}
        onClose={end}
        targetRect={targetRect}
        dialogSide={step.target === 'attribute-badge' ? 'left' : step.dialogSide}
      />
    </>,
    document.body
  )
}
