import { useState, useMemo } from 'react'
import { useProduct } from '../../context/ProductContext2'
import { computeCompleteness, groupByRequired } from '../../utils/completeness'
import CompletenessModal from './CompletenessModal'

const MissingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M7.625 4.825V7.625M7.625 10.425H7.632M14.625 7.625C14.625 11.491 11.491 14.625 7.625 14.625C3.75901 14.625 0.625 11.491 0.625 7.625C0.625 3.75901 3.75901 0.625 7.625 0.625C11.491 0.625 14.625 3.75901 14.625 7.625Z" stroke="#C41F11" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M0.195262 0.195262C0.455612 -0.0650874 0.877722 -0.0650874 1.13807 0.195262L5.13807 4.19526C5.39842 4.45561 5.39842 4.87772 5.13807 5.13807L1.13807 9.13807C0.877722 9.39842 0.455612 9.39842 0.195262 9.13807C-0.0650874 8.87772 -0.0650874 8.45561 0.195262 8.19526L3.72386 4.66667L0.195262 1.13807C-0.0650874 0.877722 -0.0650874 0.455612 0.195262 0.195262Z" fill="black"/>
  </svg>
)

export default function CompletenessWidget() {
  const { productData, activeTab } = useProduct()
  const [modalOpen, setModalOpen] = useState(false)
  const [scrollTo, setScrollTo] = useState(null)

  const stats = useMemo(() => computeCompleteness(productData), [productData])
  const { required, optional } = useMemo(() => groupByRequired(stats.perField), [stats.perField])

  const requiredMissing = required.reduce((sum, e) => sum + e.missingCount, 0)
  const optionalMissing = optional.reduce((sum, e) => sum + e.missingCount, 0)

  if (activeTab !== 'default') return null

  const openModal = (target = null) => {
    setScrollTo(target)
    setModalOpen(true)
  }

  return (
    <>
      {/* Overall card */}
      <div style={{
        display: 'flex',
        padding: '12px 16px',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '16px',
        alignSelf: 'stretch',
        borderRadius: '6px',
        border: '1px solid var(--base-border, #E4E4E7)',
        background: '#FFF',
        width: '100%',
        boxSizing: 'border-box',
      }}>

        {/* Container 1: title + score + progress bar */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '4px',
          alignSelf: 'stretch',
        }}>
          <span style={{
            fontFamily: 'var(--typography-font-family-font-sans, Inter)',
            fontSize: 'var(--typography-base-sizes-small-font-size, 14px)',
            fontWeight: 'var(--font-weight-medium, 500)',
            color: '#3F3F46',
            lineHeight: 'var(--typography-base-sizes-small-line-height, 20px)',
          }}>
            Product completeness
          </span>

          <span style={{
            overflow: 'hidden',
            color: 'var(--base-primary, #18181B)',
            textOverflow: 'ellipsis',
            fontFamily: 'var(--typography-font-family-font-sans, Inter)',
            fontSize: 'var(--typography-base-sizes-large-font-size, 18px)',
            fontStyle: 'normal',
            fontWeight: 'var(--font-weight-semibold, 600)',
            lineHeight: 'var(--typography-base-sizes-large-line-height, 28px)',
          }}>
            {stats.percentComplete}%
          </span>

          <div style={{
            display: 'flex',
            height: 'var(--height-h-15, 6px)',
            alignItems: 'center',
            alignSelf: 'stretch',
            borderRadius: 'var(--border-radius-full, 9999px)',
            background: 'var(--base-secondary, #F4F4F5)',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${stats.percentComplete}%`,
              height: '100%',
              background: 'var(--base-muted-foreground, #71717A)',
              borderRadius: '100px',
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: 'var(--base-border, #E4E4E7)',
          alignSelf: 'stretch',
        }} />

        {/* Container 2: missing values title + rows */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '8px',
          alignSelf: 'stretch',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MissingIcon />
            <span style={{
              overflow: 'hidden',
              color: 'var(--base-sidebar-foreground, #3F3F46)',
              textOverflow: 'ellipsis',
              fontFamily: 'var(--typography-font-family-font-sans, Inter)',
              fontSize: 'var(--typography-base-sizes-small-font-size, 14px)',
              fontStyle: 'normal',
              fontWeight: 'var(--font-weight-medium, 500)',
              lineHeight: 'var(--typography-base-sizes-small-line-height, 20px)',
            }}>
              Missing values
            </span>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '6px',
            alignSelf: 'stretch',
          }}>
            <button
              onClick={() => openModal('required')}
              style={{
                display: 'flex',
                padding: '8px 12px',
                justifyContent: 'space-between',
                alignItems: 'center',
                alignSelf: 'stretch',
                width: '100%',
                borderRadius: 'var(--border-radius-md, 6px)',
                border: '1px solid var(--base-input, #E4E4E7)',
                background: 'transparent',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#FAFAFA'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: '13px', color: '#3F3F46' }}>Required values</span>
              <span style={{
                fontSize: '12px',
                fontWeight: 500,
                color: '#3F3F46',
                backgroundColor: '#F4F4F5',
                borderRadius: '999px',
                padding: '1px 8px',
                minWidth: '24px',
                textAlign: 'center',
              }}>
                {requiredMissing}
              </span>
            </button>

            <button
              onClick={() => openModal('optional')}
              style={{
                display: 'flex',
                padding: '8px 12px',
                justifyContent: 'space-between',
                alignItems: 'center',
                alignSelf: 'stretch',
                width: '100%',
                borderRadius: 'var(--border-radius-md, 6px)',
                border: '1px solid var(--base-input, #E4E4E7)',
                background: 'transparent',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#FAFAFA'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: '13px', color: '#3F3F46' }}>Optional values</span>
              <span style={{
                fontSize: '12px',
                fontWeight: 500,
                color: '#3F3F46',
                backgroundColor: '#F4F4F5',
                borderRadius: '999px',
                padding: '1px 8px',
                minWidth: '24px',
                textAlign: 'center',
              }}>
                {optionalMissing}
              </span>
            </button>
          </div>
        </div>

        {/* Container 3: text CTA */}
        <div style={{
          display: 'flex',
          padding: '6px 0',
          alignItems: 'flex-start',
          gap: '4px',
          alignSelf: 'stretch',
        }}>
          <button
            onClick={() => openModal(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <span style={{
              overflow: 'hidden',
              color: 'var(--base-primary, #18181B)',
              textOverflow: 'ellipsis',
              fontFamily: 'var(--typography-font-family-font-sans, Inter)',
              fontSize: 'var(--typography-base-sizes-small-font-size, 14px)',
              fontStyle: 'normal',
              fontWeight: 'var(--font-weight-normal, 400)',
              lineHeight: '100%',
            }}>
              View all missing values
            </span>
            <ChevronRight />
          </button>
        </div>

      </div>

      <CompletenessModal open={modalOpen} onOpenChange={setModalOpen} scrollTo={scrollTo} />
    </>
  )
}
