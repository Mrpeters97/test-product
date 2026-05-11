import { useEffect, useState, useRef } from 'react'
import { PRODUCT_CARDS } from '../../constants/productCards'

export default function RightAnchorMenu() {
  const [activeSection, setActiveSection] = useState(PRODUCT_CARDS.find(c => !c.hideTitle)?.id)
  const menuRef = useRef(null)

  const sections = PRODUCT_CARDS.filter(card => !card.hideTitle).map(card => ({
    id: card.id,
    label: card.title
  }))

  useEffect(() => {
    const handleScroll = () => {
      // Update active section based on scroll position
      const scrollPosition = window.scrollY + 200

      sections.forEach((section) => {
        const element = document.getElementById(section.id)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id)
          }
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const header = document.querySelector('.fixed.top-0')
      let offset = 32
      if (header) {
        offset += header.offsetHeight
      } else {
        offset += 80
      }

      // Add variant selector height if sticky
      if (window.scrollY >= 164) {
        const variantSelector = document.getElementById('variant-selector-sticky')
        if (variantSelector && variantSelector.style.position === 'fixed') {
          offset += variantSelector.offsetHeight
        }
      }

      const elementTop = element.getBoundingClientRect().top + window.scrollY
      const scrollTo = elementTop - offset
      window.scrollTo({ top: scrollTo, behavior: 'smooth' })
      setActiveSection(sectionId)
    }
  }

  return (
    <div
      ref={menuRef}
      className="flex flex-col items-start"
      style={{
        display: 'flex',
        maxWidth: '320px',
        padding: '0 0 0 0',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '16px',
        position: 'sticky',
        top: '200px',
      }}
    >
      <span style={{
        overflow: 'hidden',
        color: 'var(--base-sidebar-foreground, #3F3F46)',
        textOverflow: 'ellipsis',
        fontFamily: 'var(--typography-font-family-font-sans, Inter)',
        fontSize: 'var(--typography-base-sizes-small-font-size, 14px)',
        fontStyle: 'normal',
        fontWeight: 'var(--font-weight-medium, 500)',
        lineHeight: 'var(--typography-base-sizes-small-line-height, 20px)'
      }}>Contents</span>
      <div className="flex flex-col" style={{ gap: '16px', width: '100%' }}>
        {sections.map((section, index) => (
          <div key={section.id} style={{ height: '20px', display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => handleClick(section.id)}
              className="transition-colors text-left hover:text-black w-full"
              style={{
                overflow: 'hidden',
                color: activeSection === section.id ? 'var(--base-foreground, #18181B)' : 'var(--base-muted-foreground, #71717A)',
                textOverflow: 'ellipsis',
                fontFamily: 'var(--typography-font-family-font-sans, Inter)',
                fontSize: 'var(--typography-base-sizes-small-font-size, 14px)',
                fontStyle: 'normal',
                fontWeight: activeSection === section.id ? 'var(--font-weight-medium, 500)' : 'var(--font-weight-normal, 400)',
                lineHeight: '100%',
                whiteSpace: 'nowrap',
              }}
            >
              <span className="mr-2">{index + 1}.</span> {section.label}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
