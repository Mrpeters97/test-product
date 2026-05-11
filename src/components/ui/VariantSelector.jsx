import React, { useState, useRef, useEffect } from 'react'
import { useProduct } from '../../context/ProductContext2'
import { useScroll } from '../../context/ScrollContext'
import { Combobox } from './combobox'
import { Button } from './button'
import {
  VARIANT_OPTIONS,
  LANGUAGE_OPTIONS,
  CHANNEL_OPTIONS,
  STICKY_CONFIG,
  LABEL_STYLE,
  HEADING_STYLE,
  DESCRIPTION_STYLE,
  BUTTON_STYLE,
  DIVIDER_STYLE,
  getAvailableLanguages,
} from '../../constants/selectorConfig'

export default function VariantSelector() {
  const { variant, handleVariantChange, language, handleLanguageChange, channel, handleChannelChange, activeTab, attributeFilter, setAttributeFilter } = useProduct()
  const { scrollY } = useScroll()
  const [selectorWidth, setSelectorWidth] = useState(null)
  const [selectorHeight, setSelectorHeight] = useState(null)
  const [headingHeight, setHeadingHeight] = useState(null)
  const [filterWidth, setFilterWidth] = useState(null)
  const containerRef = useRef(null)
  const selectorRef = useRef(null)
  const headingRef = useRef(null)
  const languageComboboxRef = useRef(null)
  const filterWidthMeasureRef = useRef(null)

  const progress = Math.min(scrollY / 60, 1)
  const isSticky = scrollY >= STICKY_CONFIG.triggerScroll

  useEffect(() => {
    // Measure the actual width and height of the selector and heading
    const measureDimensions = () => {
      if (selectorRef.current) {
        setSelectorWidth(selectorRef.current.offsetWidth)
        setSelectorHeight(selectorRef.current.offsetHeight)
      }
      if (headingRef.current) {
        setHeadingHeight(headingRef.current.offsetHeight)
      }
    }

    // Initial measurement
    measureDimensions()

    // Measure on window resize
    window.addEventListener('resize', measureDimensions)

    // Re-measure when activeTab changes (channel selector may appear/disappear)
    return () => {
      window.removeEventListener('resize', measureDimensions)
    }
  }, [activeTab])

  // Auto-fallback to English when channel doesn't support current language
  useEffect(() => {
    const available = getAvailableLanguages(channel)
    if (!available.includes(language)) {
      handleLanguageChange('English')
      setTimeout(() => {
        if (languageComboboxRef.current) {
          languageComboboxRef.current.focus()
          languageComboboxRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }
      }, 0)
    }
  }, [channel])

  // Reset filter to 'all' when switching tabs if current filter is invalid
  useEffect(() => {
    if (activeTab === 'default' && (attributeFilter === 'channel')) {
      setAttributeFilter('all')
    } else if (activeTab === 'channel-specific' && (attributeFilter === 'global')) {
      setAttributeFilter('all')
    }
  }, [activeTab, attributeFilter, setAttributeFilter])

  // Measure filter dropdown width to prevent shifting
  useEffect(() => {
    if (filterWidthMeasureRef.current) {
      setFilterWidth(filterWidthMeasureRef.current.offsetWidth)
    }
  }, [activeTab])

  // Build grouped options for language selector (only in channel-specific mode)
  const availableLanguages = activeTab === 'channel-specific' ? getAvailableLanguages(channel) : LANGUAGE_OPTIONS.map(l => l.value)
  const languageGroupedOptions = activeTab === 'channel-specific' ? [
    {
      label: 'Available on this channel',
      items: LANGUAGE_OPTIONS.filter(l => availableLanguages.includes(l.value))
    },
    {
      label: 'Unavailable on this channel',
      items: LANGUAGE_OPTIONS
        .filter(l => !availableLanguages.includes(l.value))
        .map(l => ({ ...l, disabled: true }))
    }
  ].filter(g => g.items.length > 0) : null

  return (
    <div className="w-full max-w-full">
        <div style={{ position: 'absolute', visibility: 'hidden', whiteSpace: 'nowrap', height: 'auto' }} ref={filterWidthMeasureRef}>
          <span style={{
            fontSize: 'var(--typography-base-sizes-small-font-size, 14px)',
            fontFamily: 'var(--typography-font-family-font-sans, Inter)',
            padding: 'var(--Gap-2, 8px) var(--Gap-3, 12px)',
            gap: '8px',
            display: 'flex',
            alignItems: 'center',
          }}>
            Channel attributes
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6L8 10L12 6" stroke="var(--base-foreground, #18181B)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
        <div ref={headingRef} className="flex justify-between" data-tour="variant-selector-heading" style={{ alignItems: 'flex-end', marginBottom: '12px', display: isSticky ? 'none' : 'flex' }}>
          <div>
            <h2 style={HEADING_STYLE}>Product Configuration</h2>
            <p style={DESCRIPTION_STYLE}>
              Manage product details by selecting a specific variant, and langauge combination.
            </p>
          </div>
          <div data-tour="variant-selector-filter" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              color: 'var(--base-sidebar-foreground, #3F3F46)',
              fontFamily: 'var(--typography-font-family-font-sans, Inter)',
              fontSize: 'var(--typography-base-sizes-small-font-size, 14px)',
              fontWeight: 'var(--font-weight-medium, 500)',
            }}>
              Filter
            </span>
            <div style={{
              position: 'relative',
              display: 'flex',
              height: 'var(--height-h-10, 40px)',
              width: filterWidth ? `${filterWidth}px` : 'auto',
              borderRadius: 'var(--border-radius-md, 6px)',
              border: '1px solid var(--base-input, #E4E4E7)',
              background: 'var(--base-background, #FFF)',
              alignItems: 'center',
              paddingRight: '8px',
            }}>
              <select
                value={attributeFilter}
                onChange={(e) => setAttributeFilter(e.target.value)}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  padding: 'var(--Gap-2, 8px) var(--Gap-3, 12px)',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--base-foreground, #18181B)',
                  fontSize: 'var(--typography-base-sizes-small-font-size, 14px)',
                  fontFamily: 'var(--typography-font-family-font-sans, Inter)',
                  cursor: 'pointer',
                  appearance: 'none',
                  outline: 'none',
                  opacity: 0,
                  zIndex: 1,
                }}
              >
                <option value="all">All attributes</option>
                <option value="required">Required attributes</option>
                {activeTab === 'default' && <option value="global">Global attributes</option>}
                {activeTab === 'channel-specific' && <option value="channel">Channel attributes</option>}
              </select>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                paddingLeft: 'var(--Gap-3, 12px)',
                pointerEvents: 'none',
              }}>
                <span style={{
                  color: 'var(--base-foreground, #18181B)',
                  fontSize: 'var(--typography-base-sizes-small-font-size, 14px)',
                  fontFamily: 'var(--typography-font-family-font-sans, Inter)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {attributeFilter === 'all' && 'All attributes'}
                  {attributeFilter === 'required' && 'Required attributes'}
                  {attributeFilter === 'global' && 'Global attributes'}
                  {attributeFilter === 'channel' && 'Channel attributes'}
                </span>
                <div style={{
                  display: 'flex',
                  width: '16px',
                  height: '16px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexShrink: 0,
                  marginRight: '0px',
                }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6L8 10L12 6" stroke="var(--base-foreground, #18181B)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Selectors container */}
        <div
          ref={selectorRef}
          id="variant-selector-sticky"
          data-tour="variant-selector"
          style={{
            display: 'flex',
            padding: 'var(--Gap-3, 12px) var(--Gap-6, 24px)',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: isSticky ? '0px 0px 6px 6px' : '6px',
            border: '1px solid var(--base-border, #E4E4E7)',
            borderTop: '1px solid var(--base-border, #E4E4E7)',
            background: '#FFFFFF',
            gap: '24px',
            position: isSticky ? 'fixed' : 'relative',
            top: isSticky ? `${STICKY_CONFIG.stickyTop + 1}px` : 'auto',
            left: isSticky ? 'max(calc(256px + 24px), calc(50vw - 832px))' : 'auto',
            right: 'auto',
            width: isSticky && selectorWidth ? `${selectorWidth}px` : 'auto',
            zIndex: isSticky ? STICKY_CONFIG.zIndex : 1000,
            boxShadow: isSticky ? '0 4px 4px 0 rgba(0, 0, 0, 0.10)' : 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div className="flex-1 flex flex-col gap-2">
            <label style={LABEL_STYLE}>Variant</label>
            <Combobox
              options={VARIANT_OPTIONS}
              value={variant}
              onValueChange={handleVariantChange}
              placeholder="128 Black"
              className="bg-white border-gray-200 h-10 shadow-none"
            />
          </div>

          <div style={DIVIDER_STYLE} />

          {activeTab === 'channel-specific' && (
            <>
              <div className="flex-0 flex flex-col gap-2" style={{ minWidth: '180px' }}>
                <label style={LABEL_STYLE}>Channel</label>
                <Combobox
                  options={CHANNEL_OPTIONS}
                  value={channel}
                  onValueChange={handleChannelChange}
                  placeholder="Belsimpel.nl"
                  className="bg-white border-gray-200 h-10 shadow-none"
                />
              </div>

              <div style={DIVIDER_STYLE} />
            </>
          )}

          <div className="flex-0 flex flex-col gap-2" style={{ minWidth: '180px' }}>
            <label style={LABEL_STYLE}>Language</label>
            <Combobox
              ref={languageComboboxRef}
              options={activeTab === 'default' ? LANGUAGE_OPTIONS : undefined}
              groupedOptions={activeTab === 'channel-specific' ? languageGroupedOptions : undefined}
              value={language}
              onValueChange={handleLanguageChange}
              placeholder="English"
              className="bg-white border-gray-200 h-10 shadow-none"
              dropdownClassName={activeTab === 'channel-specific' ? 'min-w-80' : undefined}
            />
          </div>
        </div>
        {isSticky && (
          <div style={{ height: `${headingHeight && selectorHeight ? headingHeight + 24 + selectorHeight : 160}px` }} />
        )}
    </div>
  )
}
