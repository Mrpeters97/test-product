import { useEffect, useState, useCallback } from 'react'
import { X } from 'lucide-react'
import { ToastIcon } from './Icons'

export default function Toast({ message, onClose, duration = 3000, variant = 'success' }) {
  const [isExiting, setIsExiting] = useState(false)

  const handleClose = useCallback(() => {
    setIsExiting(true)
    // Wait for exit animation to complete before calling onClose
    setTimeout(() => {
      onClose()
    }, 300) // Corresponds to animation duration
  }, [onClose])

  useEffect(() => {
    const closeTimer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(closeTimer)
  }, [duration, handleClose])

  // Variant styles
  const variantStyles = {
    success: {
      bgColor: 'bg-[var(--tailwind-colors-green-700,#15803D)]',
      borderColor: 'border-solid border-[var(--alpha-70,rgba(255,255,255,0.30))]',
      shadowColor: 'shadow-[0_0_0_4px_rgba(21,128,61,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-2px_rgba(0,0,0,0.05)]',
      progressBg: 'bg-blue-500/20',
      progressBar: 'bg-blue-500',
      showIcon: true,
      showProgress: true,
      textColor: 'text-[color:var(--base-primary-foreground,#FAFAFA)]'
    },
    system: {
      bgColor: 'bg-[var(--base-accent-foreground,#18181B)]',
      borderColor: 'border border-[var(--alpha-70,rgba(255,255,255,0.30))]',
      shadowColor: 'shadow-[0_0_0_4px_rgba(0,0,0,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-2px_rgba(0,0,0,0.05)]',
      progressBg: 'bg-white/10',
      progressBar: 'bg-white/50',
      showIcon: false,
      showProgress: true,
      textColor: 'text-white'
    }
  }

  const style = variantStyles[variant] || variantStyles.success

  return (
    <div
      className={`fixed left-1/2 top-[32px] w-[500px] -translate-x-1/2 overflow-hidden rounded-[var(--border-radius-md,6px)] ${style.borderColor} ${style.bgColor} ${style.shadowColor}`}
      style={{
        zIndex: 10000,
        animation: isExiting
          ? 'toast-out 0.3s cubic-bezier(0.4, 0, 1, 1) forwards'
          : 'toast-in 0.3s cubic-bezier(0, 0, 0.2, 1) forwards',
      }}
    >
      <div className={`flex w-full items-center gap-[var(--Gap-2,8px)] px-[var(--Gap-4,16px)] py-[var(--Gap-3-5,14px)] ${style.textColor}`}>
        {style.showIcon && <ToastIcon />}
        <span className={`flex-1 font-[family-name:var(--typography-font-family-font-sans,Inter)] text-[length:var(--typography-base-sizes-small-font-size,14px)] font-[number:var(--font-weight-semibold,600)] leading-[var(--typography-base-sizes-small-line-height,20px)]`}>
          {message}
        </span>
        <button onClick={handleClose} className="ml-auto pl-4 text-white/80 hover:text-white transition-colors flex-shrink-0">
          {variant === 'system' ? <X className="h-4 w-4" /> : '×'}
        </button>
      </div>
      {style.showProgress && (
        <div className={`h-[2px] w-full ${style.progressBg}`}>
          <div
            className={`h-full ${style.progressBar}`}
            style={{ animation: `progress ${duration / 1000}s linear forwards` }}
          />
        </div>
      )}
      <style>{`
        @keyframes toast-in {
          from {
            transform: translate(-50%, -100%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
        @keyframes toast-out {
          from {
            transform: translate(-50%, 0);
            opacity: 1;
          }
          to {
            transform: translate(-50%, -100%);
            opacity: 0;
          }
        }
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  )
}