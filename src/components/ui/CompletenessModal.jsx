import { useState, useMemo, useEffect, useRef } from 'react'
import { Dialog, DialogContent } from './dialog'
import { useProduct } from '../../context/ProductContext2'
import { computeCompleteness, groupByRequired } from '../../utils/completeness'

const CountBadge = ({ children, dark }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: dark ? 'var(--base-primary, #18181B)' : '#F4F4F5',
      color: dark ? 'var(--base-primary-foreground, #FAFAFA)' : '#3F3F46',
      borderRadius: 'var(--border-radius-full, 9999px)',
      border: dark ? '1px solid rgba(255, 255, 255, 0.00)' : 'none',
      padding: 'var(--Gap-0-5, 2px) var(--Gap-2-5, 10px)',
      fontSize: 'var(--typography-base-sizes-extra-small-font-size, 12px)',
      fontWeight: 'var(--font-weight-medium, 500)',
      lineHeight: 'var(--typography-base-sizes-extra-small-line-height, 16px)',
      fontFamily: 'var(--typography-font-family-font-sans, Inter)',
      minWidth: '28px',
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
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      flexShrink: 0,
    }}
  >
    <path d="M4 6L8 10L12 6" stroke="#71717A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const VariantGroup = ({ group, isTranslatable, onNavigate, entry, isFirst, open, onToggle }) => {
  if (!isTranslatable) {
    return (
      <button
        type="button"
        onClick={() => onNavigate(entry, group.slots[0])}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '12px 16px',
          background: '#FAFAFA',
          border: 'none',
          borderTop: isFirst ? 'none' : '1px solid #F4F4F5',
          cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
          textAlign: 'left',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F0F0F1')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FAFAFA')}
      >
        <span style={{ fontSize: '14px', color: '#18181B' }}>{group.label}</span>
        <CountBadge>{group.slots.length}</CountBadge>
      </button>
    )
  }

  return (
    <div style={{ borderTop: isFirst ? 'none' : '1px solid #F4F4F5' }}>
      <button
        type="button"
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '12px 16px',
          background: '#FAFAFA',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F0F0F1')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FAFAFA')}
      >
        <span style={{ fontSize: '14px', fontWeight: 500, color: '#18181B' }}>{group.label}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <CountBadge>{group.slots.length}</CountBadge>
          <Chevron open={open} />
        </span>
      </button>

      <div style={{
        display: 'grid',
        gridTemplateRows: open ? '1fr' : '0fr',
        transition: 'grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ borderTop: '1px solid #F4F4F5' }}>
            {group.slots.map((slot, idx) => (
              <button
                key={`${slot.language ?? '_'}-${idx}`}
                type="button"
                onClick={() => onNavigate(entry, slot)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  padding: '10px 16px 10px 32px',
                  background: 'transparent',
                  border: 'none',
                  borderTop: idx === 0 ? 'none' : '1px solid #F4F4F5',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  color: '#18181B',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FAFAFA')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {slot.language}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const AttributeRow = ({ entry, onNavigate, open, onToggle }) => {
  const [openVariantKey, setOpenVariantKey] = useState(null)
  if (entry.missingCount === 0) return null

  const isVariant = entry.field.differsOn?.includes('variant')
  const isTranslatable = entry.field.differsOn?.includes('language')

  const handleVariantToggle = (key) => setOpenVariantKey((prev) => (prev === key ? null : key))

  const variantGroups = useMemo(() => {
    if (!isVariant) return null
    const map = {}
    entry.missingSlots.forEach((slot) => {
      const key = slot.variant ?? '_base'
      if (!map[key]) map[key] = { label: slot.variant ?? 'All variants', slots: [] }
      map[key].slots.push(slot)
    })
    return Object.values(map)
  }, [entry.missingSlots, isVariant])

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
        onClick={onToggle}
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

      <div style={{
        display: 'grid',
        gridTemplateRows: open ? '1fr' : '0fr',
        transition: 'grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ borderTop: '1px solid #F4F4F5' }}>
            {isVariant ? (
              variantGroups.map((group, idx) => (
                <VariantGroup
                  key={group.label}
                  group={group}
                  isTranslatable={isTranslatable}
                  onNavigate={onNavigate}
                  entry={entry}
                  isFirst={idx === 0}
                  open={openVariantKey === group.label}
                  onToggle={() => handleVariantToggle(group.label)}
                />
              ))
            ) : (
              entry.missingSlots.map((slot, idx) => (
                <button
                  key={`${slot.language ?? '_'}-${idx}`}
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
                  {slot.language ?? 'All languages'}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const Section = ({ title, entries, totalMissing, onNavigate, emptyLabel }) => {
  const [openKey, setOpenKey] = useState(null)
  const handleToggle = (key) => setOpenKey((prev) => (prev === key ? null : key))

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
              <AttributeRow
                key={entry.field.key}
                entry={entry}
                onNavigate={onNavigate}
                open={openKey === entry.field.key}
                onToggle={() => handleToggle(entry.field.key)}
              />
            ))}
        </div>
      )}
    </div>
  )
}

export default function CompletenessModal({ open, onOpenChange, scrollTo = null }) {
  const { productData, handleVariantChange, handleLanguageChange } = useProduct()
  const scrollContainerRef = useRef(null)
  const requiredSectionRef = useRef(null)
  const optionalSectionRef = useRef(null)

  const stats = useMemo(() => computeCompleteness(productData), [productData])
  const { required, optional } = useMemo(() => groupByRequired(stats.perField), [stats.perField])

  const sumMissing = (list) => list.reduce((sum, e) => sum + e.missingCount, 0)
  const requiredMissing = sumMissing(required)
  const optionalMissing = sumMissing(optional)

  useEffect(() => {
    if (!open || !scrollTo) return
    const timer = setTimeout(() => {
      const target = scrollTo === 'required' ? requiredSectionRef.current : optionalSectionRef.current
      if (target && scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: target.offsetTop, behavior: 'smooth' })
      }
    }, 100)
    return () => clearTimeout(timer)
  }, [open, scrollTo])

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
        className="w-[92vw]"
        style={{
          minWidth: '720px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 'var(--Gap-4, 16px)',
          padding: 'var(--Gap-8, 32px)',
          borderRadius: 'var(--border-radius-lg, 8px)',
          border: '1px solid var(--base-border, #E4E4E7)',
          background: 'var(--base-background, #FFF)',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', alignSelf: 'stretch' }}>
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: '#18181B',
              margin: 0,
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '-0.4px',
              lineHeight: '28px',
            }}
          >
            Product completeness
          </h2>
          <CountBadge dark>{stats.percentComplete}%</CountBadge>
        </div>

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

        <div
          ref={scrollContainerRef}
          style={{
            overflowY: 'auto',
            flex: 1,
            width: '100%',
          }}
        >
          <div ref={requiredSectionRef}>
            <Section
              title="Missing required attributes"
              entries={required}
              totalMissing={requiredMissing}
              onNavigate={handleNavigate}
              emptyLabel="All required attributes are filled in."
            />
          </div>

          <div style={{ height: '1px', backgroundColor: '#E4E4E7', margin: '8px 0 24px 0' }} />

          <div ref={optionalSectionRef}>
            <Section
              title="Other missing attributes"
              entries={optional}
              totalMissing={optionalMissing}
              onNavigate={handleNavigate}
              emptyLabel="All optional attributes are filled in."
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
