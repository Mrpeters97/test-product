import { useState, useMemo } from 'react'
import { Dialog, DialogContent } from './dialog'
import { useProduct } from '../../context/ProductContext2'
import { computeCompleteness, groupByRequired } from '../../utils/completeness'

const CountBadge = ({ children }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F4F4F5',
      color: '#3F3F46',
      borderRadius: '9999px',
      padding: '2px 10px',
      fontSize: '12px',
      fontWeight: 500,
      minWidth: '28px',
      fontFamily: 'Inter, sans-serif',
    }}
  >
    {children}
  </span>
)

const Chevron = ({ open }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    style={{
      transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.15s ease',
    }}
  >
    <path d="M4 6L8 10L12 6" stroke="#71717A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const AttributeRow = ({ entry, onNavigate }) => {
  const [open, setOpen] = useState(false)
  if (entry.missingCount === 0) return null

  return (
    <div
      style={{
        border: '1px solid #E4E4E7',
        borderRadius: '8px',
        backgroundColor: '#fff',
        overflow: 'hidden',
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '14px 16px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <span style={{ fontSize: '14px', fontWeight: 500, color: '#18181B' }}>
          {entry.field.label}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
          <CountBadge>{entry.missingCount}</CountBadge>
          <Chevron open={open} />
        </span>
      </button>

      {open && (
        <div style={{ borderTop: '1px solid #F4F4F5' }}>
          {entry.missingSlots.map((slot, idx) => {
            const variantLabel = slot.variant ?? 'All variants'
            const languageLabel = slot.language ?? (entry.field.differsOn?.includes('language') ? '' : 'All languages')
            return (
              <button
                key={`${slot.variant ?? '_'}-${slot.language ?? '_'}-${idx}`}
                type="button"
                onClick={() => onNavigate(entry, slot)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '12px 16px',
                  background: 'transparent',
                  border: 'none',
                  borderTop: idx === 0 ? 'none' : '1px solid #F4F4F5',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: '#18181B',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FAFAFA')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <span>{variantLabel}</span>
                <span style={{ color: '#3F3F46' }}>{languageLabel}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

const Section = ({ title, entries, totalMissing, onNavigate, emptyLabel }) => {
  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <h4
          style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#18181B',
            margin: 0,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {title}
        </h4>
        <CountBadge>{totalMissing}</CountBadge>
      </div>
      {totalMissing === 0 ? (
        emptyLabel && (
          <p
            style={{
              fontSize: '13px',
              color: '#71717A',
              margin: 0,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {emptyLabel}
          </p>
        )
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {entries
            .filter((e) => e.missingCount > 0)
            .map((entry) => (
              <AttributeRow key={entry.field.key} entry={entry} onNavigate={onNavigate} />
            ))}
        </div>
      )}
    </div>
  )
}

export default function CompletenessModal({ open, onOpenChange }) {
  const { productData, handleVariantChange, handleLanguageChange } = useProduct()

  const stats = useMemo(() => computeCompleteness(productData), [productData])
  const { required, optional } = useMemo(() => groupByRequired(stats.perField), [stats.perField])

  const sumMissing = (list) => list.reduce((sum, e) => sum + e.missingCount, 0)
  const requiredMissing = sumMissing(required)
  const optionalMissing = sumMissing(optional)

  const handleNavigate = (entry, slot) => {
    onOpenChange(false)
    if (slot.variant) handleVariantChange(slot.variant)
    if (slot.language && entry.field.differsOn?.includes('language')) {
      handleLanguageChange(slot.language)
    }
    setTimeout(() => {
      const el = document.getElementById(entry.cardId)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 150)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[720px] w-[92vw] p-0"
        style={{ maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ padding: '28px 32px 8px 32px' }}>
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: '#18181B',
              marginBottom: '8px',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '-0.4px',
            }}
          >
            Completeness overview
          </h2>
          <p
            style={{
              fontSize: '14px',
              color: '#71717A',
              margin: 0,
              lineHeight: '20px',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Select a language to view the completion scores per variant and channel, providing an
            overview of required and optional values per variant.
          </p>
        </div>

        <div
          style={{
            padding: '20px 32px 32px 32px',
            overflowY: 'auto',
            flex: 1,
          }}
        >
          <Section
            title="Missing required attributes"
            entries={required}
            totalMissing={requiredMissing}
            onNavigate={handleNavigate}
            emptyLabel="All required attributes are filled in."
          />

          <div style={{ height: '1px', backgroundColor: '#E4E4E7', margin: '8px 0 24px 0' }} />

          <Section
            title="Other missing attributes"
            entries={optional}
            totalMissing={optionalMissing}
            onNavigate={handleNavigate}
            emptyLabel="All optional attributes are filled in."
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
