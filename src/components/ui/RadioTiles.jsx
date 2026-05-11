export default function RadioTiles({ options, value, onValueChange, disabled }) {
  return (
    <div className="flex gap-3 w-full">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => !disabled && onValueChange(option.value)}
          disabled={disabled}
          style={{
            borderRadius: 'var(--border-radius-default, 6px)',
            border: disabled
              ? 'var(--border-width-border-1, 1px) solid var(--base-input, #E4E4E7)'
              : value === option.value
              ? 'var(--border-width-border-1, 1px) solid var(--base-foreground, #18181B)'
              : 'var(--border-width-border-1, 1px) solid var(--base-border, #E4E4E7)',
            background: disabled ? 'var(--base-muted, #F4F4F5)' : 'var(--base-background, #FFF)',
            color: 'var(--base-foreground, #18181B)',
            display: 'flex',
            padding: 'var(--Gap-2, 8px) var(--Gap-3, 12px)',
            alignItems: 'center',
            gap: 'var(--Gap-2, 8px)',
            flex: '1 0 0',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: 'var(--opacity-opacity-100, 1)',
            transition: 'all 0.2s ease',
            fontFamily: 'var(--typography-font-family-font-sans, Inter)',
            fontSize: 'var(--typography-base-sizes-small-font-size, 14px)',
            fontStyle: 'normal',
            fontWeight: value === option.value ? 'var(--font-weight-medium, 500)' : 'var(--font-weight-normal, 400)',
            lineHeight: '100%',
            height: '40px',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" style={{ flexShrink: 0 }}>
            <circle
              cx="10"
              cy="10"
              r="9"
              fill={value === option.value ? 'var(--base-background, #FFF)' : 'none'}
              stroke={disabled ? 'var(--base-muted-foreground, #71717A)' : value === option.value ? 'var(--base-primary, #18181B)' : 'var(--base-border, #E4E4E7)'}
              strokeWidth="1"
            />
            {value === option.value && (
              <circle cx="10" cy="10" r="5" fill={disabled ? 'var(--base-muted-foreground, #71717A)' : 'var(--base-primary, #18181B)'} />
            )}
          </svg>
          <span style={{
            color: disabled ? 'var(--base-muted-foreground, #71717A)' : 'var(--base-foreground, #18181B)',
            fontFamily: 'var(--typography-font-family-font-sans, Inter)',
            fontSize: 'var(--typography-base-sizes-small-font-size, 14px)',
            fontStyle: 'normal',
            fontWeight: 'var(--font-weight-normal, 400)',
            lineHeight: '100%',
          }}>{option.label}</span>
        </button>
      ))}
    </div>
  )
}
