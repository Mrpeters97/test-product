import { Button } from '../ui/button'
import { VerticalDotsIcon } from '../ui/Icons'
import { useScroll } from '../../context/ScrollContext'
import { useProduct } from '../../context/ProductContext2'
import { STICKY_CONFIG } from '../../constants/selectorConfig'

export default function PageHeader() {
  const { scrollY } = useScroll()
  const { activeTab, setActiveTab } = useProduct()
  const isVariantSelectorSticky = scrollY >= STICKY_CONFIG.triggerScroll

  // Animation progress: 0 (no scroll) to 1 (>= 60px scroll)
  const progress = Math.min(scrollY / 60, 1)

  // Active tab border color changes based on sticky state
  const activeTabBorderColor = isVariantSelectorSticky ? '#FFF' : '#FAFAFA'

  return (
    <div
      className="fixed top-0 left-64 right-0 flex flex-col items-start self-stretch"
      style={{
        fontFamily: 'var(--typography-font-family-font-sans, Inter)',
        paddingBottom: '0',
        paddingTop: `${16 + 8 * (1 - progress)}px`,
        gap: '16px',
        transition: 'padding 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 9999,
        borderBottom: '1px solid #71717A',
        background: 'var(--base-background, #FFF)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          width: '100%',
          maxWidth: '1920px',
          marginLeft: 'max(calc(24px), calc(50vw - 1088px))',
          paddingRight: '24px',
          paddingLeft: '0',
        }}
      >
      {/* Breadcrumbs - Always in DOM, fully smooth fade/slide */}
      <div 
        className="flex items-center flex-wrap w-full"
        style={{
          display: 'flex',
          alignItems: 'center',
          alignContent: 'center',
          gap: '10px',
          flexWrap: 'wrap',
          fontFamily: 'var(--typography-font-family-font-sans, Inter)',
          fontSize: 'var(--typography-base-sizes-small-font-size, 14px)',
          fontStyle: 'normal',
          fontWeight: 'var(--font-weight-normal, 400)',
          lineHeight: 'var(--typography-base-sizes-small-line-height, 20px)',
          opacity: 1 - progress,
          transform: `translateY(-${12 * progress}px)`,
          pointerEvents: progress === 1 ? 'none' : 'auto',
          marginBottom: `${-10 * progress}px`,
          height: `${20 * (1 - progress)}px`,
          transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), margin-bottom 0.5s cubic-bezier(0.4, 0, 0.2, 1), height 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <span style={{ color: 'var(--base-muted-foreground, #71717A)' }}>Dashboard</span>
        <span className="text-gray-400">&rsaquo;</span>
        <span style={{ color: 'var(--base-muted-foreground, #71717A)' }}>All products</span>
        <span className="text-gray-400">&rsaquo;</span>
        <span style={{ color: 'var(--base-muted-foreground, #71717A)' }}>Samsung Galaxy Watch 13</span>
        <span className="text-gray-400">&rsaquo;</span>
        <span style={{ color: 'var(--base-foreground, #18181B)' }}>Edit product</span>
      </div>

      {/* Main Header */}
      <div className="w-full flex items-center justify-between" style={{ height: '32px' }}>
        {/* Left side: Title, Badge, Divider, Completeness CTA */}
        <div 
          className="flex items-center"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--Gap-3, 12px)',
          }}
        >
          <h1 style={{
            color: 'var(--base-foreground, #18181B)',
            fontFamily: 'var(--typography-typography-components-h3-font-family, Inter)',
            fontSize: '20px',
            fontStyle: 'normal',
            fontWeight: 'var(--typography-typography-components-h3-font-weight, 600)',
            lineHeight: 'var(--typography-typography-components-h3-line-height, 32px)',
            letterSpacing: 'var(--typography-typography-components-h3-letter-spacing, -0.4px)',
            margin: 0,
          }}>
            Samsung Galaxy Watch 13
          </h1>

          {/* Draft Badge */}
          <span data-tour="draft-badge" style={{
            borderRadius: 'var(--border-radius-full, 9999px)',
            border: '1px solid var(--tailwind-colors-base-transparent, rgba(255, 255, 255, 0.00))',
            background: 'var(--base-secondary, #F4F4F5)',
            padding: '4px 8px',
            fontSize: '12px',
            fontWeight: '500',
            color: 'var(--base-sidebar-foreground, #3F3F46)',
          }}>
            Draft
          </span>

        </div>

        {/* Right side: Autosaved, Publish CTA, Menu */}
        <div className="flex items-center gap-4">
          <span style={{
            color: 'var(--base-foreground, #18181B)',
            fontFamily: 'var(--typography-font-family-font-sans, Inter)',
            fontSize: 'var(--typography-base-sizes-extra-small-font-size, 12px)',
            fontStyle: 'normal',
            fontWeight: 'var(--font-weight-normal, 400)',
            lineHeight: 'var(--typography-base-sizes-extra-small-line-height, 16px)',
          }}>
            Autosaved: 28-01-2026 16:07
          </span>
          <button
            data-tour="publish-button"
            style={{
              borderRadius: 'var(--border-radius-md, 6px)',
              padding: '10px 16px',
              fontSize: 'var(--typography-base-sizes-small-font-size, 14px)',
              fontFamily: 'var(--typography-font-family-font-sans, Inter)',
              fontWeight: 'var(--font-weight-medium, 500)',
              lineHeight: 'var(--typography-base-sizes-small-line-height, 20px)',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: 'var(--base-foreground, #18181B)',
              color: 'var(--base-primary-foreground, #FAFAFA)',
            }}
          >
            Add to catalog
          </button>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
            <VerticalDotsIcon />
          </Button>
        </div>
      </div>

      {/* Tab Structure */}
      <div
        className="w-full flex items-center"
        style={{
          display: 'flex',
          paddingTop: '0',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 'var(--Gap-2, 8px)',
          marginLeft: '-24px',
          marginRight: '-24px',
          paddingLeft: '24px',
          paddingRight: '24px',
        }}
      >
        <div data-tour="tab-structure" style={{ display: 'flex', gap: 'var(--Gap-2, 8px)' }}>
        <button
          onClick={() => setActiveTab('default')}
          style={{
            borderRadius: '6px 6px 0 0',
            borderTop: activeTab === 'default' ? '1px solid #71717A' : '1px solid #E4E4E7',
            borderLeft: activeTab === 'default' ? '1px solid #71717A' : '1px solid #E4E4E7',
            borderRight: activeTab === 'default' ? '1px solid #71717A' : '1px solid #E4E4E7',
            borderBottom: activeTab === 'default' ? `1px solid ${activeTabBorderColor}` : 'none',
            background: activeTab === 'default' ? '#FAFAFA' : '#FFF',
            padding: '12px 16px',
            fontSize: 'var(--typography-base-sizes-small-font-size, 14px)',
            fontStyle: 'normal',
            fontWeight: activeTab === 'default' ? '600' : 'var(--font-weight-medium, 500)',
            color: activeTab === 'default' ? 'var(--base-foreground, #18181B)' : 'var(--base-muted-foreground, #71717A)',
            cursor: 'pointer',
            fontFamily: 'var(--typography-font-family-font-sans, Inter)',
            lineHeight: 'var(--typography-base-sizes-small-line-height, 20px)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'default' ? `0px 1px 0px 0px ${activeTabBorderColor}` : 'none',
          }}
        >
          Default values
        </button>
        <button
          onClick={() => setActiveTab('channel-specific')}
          style={{
            borderRadius: '6px 6px 0 0',
            borderTop: activeTab === 'channel-specific' ? '1px solid #71717A' : '1px solid #E4E4E7',
            borderLeft: activeTab === 'channel-specific' ? '1px solid #71717A' : '1px solid #E4E4E7',
            borderRight: activeTab === 'channel-specific' ? '1px solid #71717A' : '1px solid #E4E4E7',
            borderBottom: activeTab === 'channel-specific' ? `1px solid ${activeTabBorderColor}` : 'none',
            background: activeTab === 'channel-specific' ? '#FAFAFA' : '#FFF',
            padding: '12px 16px',
            fontSize: 'var(--typography-base-sizes-small-font-size, 14px)',
            fontStyle: 'normal',
            fontWeight: activeTab === 'channel-specific' ? '600' : 'var(--font-weight-medium, 500)',
            color: activeTab === 'channel-specific' ? 'var(--base-foreground, #18181B)' : 'var(--base-muted-foreground, #71717A)',
            cursor: 'pointer',
            fontFamily: 'var(--typography-font-family-font-sans, Inter)',
            lineHeight: 'var(--typography-base-sizes-small-line-height, 20px)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'channel-specific' ? `0px 1px 0px 0px ${activeTabBorderColor}` : 'none',
          }}
        >
          Channel values
        </button>
        </div>
      </div>
      </div>
    </div>
  )
}
