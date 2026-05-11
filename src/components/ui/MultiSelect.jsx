import * as React from "react"
import { Search, ChevronDown } from 'lucide-react'
import { cn } from "../../lib/utils"

const MultiSelect = React.forwardRef(
  ({ className, options = [], value = [], onValueChange, placeholder, disabled = false, ...props }, ref) => {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState('')
    const containerRef = React.useRef(null)
    const inputRef = React.useRef(null)

    React.useEffect(() => {
      const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
          setOpen(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside, true)
      return () => document.removeEventListener('mousedown', handleClickOutside, true)
    }, [])

    const filtered = options.filter(opt =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    )

    const handleSelect = (optionValue) => {
      const newValue = Array.isArray(value) ? value : []
      if (newValue.includes(optionValue)) {
        onValueChange(newValue.filter(v => v !== optionValue))
      } else {
        onValueChange([...newValue, optionValue])
      }
    }

    const handleRemove = (optionValue) => {
      const newValue = Array.isArray(value) ? value : []
      onValueChange(newValue.filter(v => v !== optionValue))
    }

    const selectedLabels = (Array.isArray(value) ? value : [])
      .filter(v => v)
      .map(v =>
        options.find(opt => opt.value === v)?.label
      ).filter(Boolean)

    return (
      <div ref={containerRef} className="relative w-full">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          disabled={disabled}
          style={disabled ? {
            display: 'flex',
            height: 'var(--height-h-10, 40px)',
            padding: 'var(--Gap-2, 8px) var(--Gap-3, 12px)',
            justifyContent: 'space-between',
            alignItems: 'center',
            alignSelf: 'stretch',
            borderRadius: 'var(--border-radius-md, 6px)',
            border: '1px solid var(--base-input, #E4E4E7)',
            opacity: 'var(--opacity-opacity-100, 1)',
            background: 'var(--base-muted, #F4F4F5)',
            cursor: 'not-allowed',
          } : {
            width: '100%',
            padding: '8px 12px',
            backgroundColor: 'white',
            border: '1px solid #E4E4E7',
            borderRadius: '6px',
            focus: 'outline-none',
          }}
          className={cn(
            "w-full px-3 py-2 bg-white border border-[#E4E4E7] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between",
            !disabled && "hover:border-gray-300"
          )}
        >
          <div className="flex items-center gap-2">
            {selectedLabels.length > 0 ? (
              <span style={{
                overflow: 'hidden',
                color: 'var(--base-foreground, #18181B)',
                textOverflow: 'ellipsis',
                fontFamily: 'var(--typography-font-family-font-sans, Inter)',
                fontSize: 'var(--typography-base-sizes-small-font-size, 14px)',
                fontStyle: 'normal',
                fontWeight: 'var(--font-weight-normal, 400)',
                lineHeight: 'var(--typography-base-sizes-small-line-height, 20px)',
              }}>
                {selectedLabels.length} option{selectedLabels.length !== 1 ? 's' : ''} selected
              </span>
            ) : (
              <span style={{
                color: 'var(--base-muted-foreground, #71717A)',
                fontFamily: 'var(--typography-font-family-font-sans, Inter)',
                fontSize: 'var(--typography-base-sizes-small-font-size, 14px)',
              }}>{placeholder}</span>
            )}
          </div>
          <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E4E4E7] rounded-md shadow-lg z-50">
            <div className="p-2 border-b border-[#E4E4E7]">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-2 py-1 border border-[#E4E4E7] rounded text-sm focus:outline-none"
              />
            </div>
            <div className="max-h-60 overflow-y-auto">
              {filtered.length > 0 ? (
                filtered.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      "w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2",
                      (Array.isArray(value) ? value : []).includes(option.value) && "bg-gray-50 font-medium"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={(Array.isArray(value) ? value : []).includes(option.value)}
                      onChange={() => {}}
                      className="w-4 h-4"
                    />
                    {option.label}
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500">No options found</div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }
)

MultiSelect.displayName = "MultiSelect"

export default MultiSelect
