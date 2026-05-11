import React from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Combobox } from '../components/ui/combobox'
import RadioTiles from '../components/ui/RadioTiles'
import MultiSelect from '../components/ui/MultiSelect'

export const READONLY_INPUT_STYLE = {
  backgroundColor: '#F4F4F5',
  color: 'var(--base-muted-foreground, #71717A)',
  cursor: 'default',
}

export const DISABLED_INPUT_STYLE = {
  borderRadius: 'var(--border-radius-md, 6px)',
  border: 'var(--border-width-border-1, 1px) solid var(--base-input, #E4E4E7)',
  background: 'var(--base-background, #FFF)',
  overflow: 'hidden',
  color: 'var(--base-muted-foreground, #71717A)',
  textOverflow: 'ellipsis',
  fontFamily: 'var(--typography-font-family-font-sans, Inter)',
  fontSize: 'var(--typography-base-sizes-small-font-size, 14px)',
  fontStyle: 'normal',
  fontWeight: 'var(--font-weight-normal, 400)',
  lineHeight: 'var(--typography-base-sizes-small-line-height, 20px)',
}

export const isValueEmpty = (value) => {
  if (value === null || value === undefined || value === '') return true
  if (Array.isArray(value)) return value.every(v => !v)
  return false
}

/**
 * Renders form field based on field configuration
 */
export const renderField = (fieldConfig, value, handleFieldChange, handleArrayFieldChange, handleAddArrayField, getProductFieldValue) => {
  if (fieldConfig.type === 'text-array') {
    return (
      <div className="flex-1">
        {value.map((item, index) => (
          <Input
            key={index}
            type="text"
            value={item}
            onChange={(e) => handleArrayFieldChange(fieldConfig.key, index, e.target.value)}
            placeholder={fieldConfig.placeholder}
            className="w-full"
            required={fieldConfig.required}
            readOnly={fieldConfig.readonly}
            style={{
              ...(fieldConfig.isInheritedChannelValue ? DISABLED_INPUT_STYLE : {}),
              ...(fieldConfig.isInheritedChannelValue ? { pointerEvents: 'none' } : {}),
              ...(fieldConfig.readonly && !fieldConfig.isInheritedChannelValue ? READONLY_INPUT_STYLE : {}),
            }}
          />
        ))}
      </div>
    )
  }

  if (fieldConfig.type === 'select') {
    if (fieldConfig.readonly || fieldConfig.isInheritedChannelValue) {
      const selectedLabel = fieldConfig.options.find(opt => opt.value === value)?.label || value || fieldConfig.placeholder
      return (
        <div
          style={{
            display: 'flex',
            height: 'var(--height-h-10, 40px)',
            padding: 'var(--Gap-2, 8px) var(--Gap-3, 12px)',
            justifyContent: 'space-between',
            alignItems: 'center',
            alignSelf: 'stretch',
            borderRadius: 'var(--border-radius-md, 6px)',
            border: '1px solid var(--base-input, #E4E4E7)',
            opacity: 1,
            background: fieldConfig.isInheritedChannelValue ? 'var(--base-background, #FFF)' : 'var(--base-muted, #F4F4F5)',
            flex: 1,
            ...(fieldConfig.isInheritedChannelValue ? { pointerEvents: 'none' } : {}),
          }}
        >
          <span style={{
            overflow: 'hidden',
            color: 'var(--base-muted-foreground, #71717A)',
            textOverflow: 'ellipsis',
            fontFamily: 'var(--typography-font-family-font-sans, Inter)',
            fontSize: 'var(--typography-base-sizes-small-font-size, 14px)',
            fontStyle: 'normal',
            fontWeight: 'var(--font-weight-normal, 400)',
            lineHeight: 'var(--typography-base-sizes-small-line-height, 20px)',
          }}>
            {selectedLabel}
          </span>
        </div>
      )
    }

    return (
      <div className="flex-1">
        <Combobox
          options={fieldConfig.options}
          value={value}
          onValueChange={(newValue) => handleFieldChange(fieldConfig.key, newValue)}
          placeholder={fieldConfig.placeholder}
        />
      </div>
    )
  }

  if (fieldConfig.type === 'multiselect') {
    if (fieldConfig.readonly || fieldConfig.isInheritedChannelValue) {
      const filteredValue = Array.isArray(value) ? value.filter(v => v) : []
      const selectedCount = filteredValue.length
      return (
        <div
          style={{
            display: 'flex',
            height: 'var(--height-h-10, 40px)',
            padding: 'var(--Gap-2, 8px) var(--Gap-3, 12px)',
            justifyContent: 'space-between',
            alignItems: 'center',
            alignSelf: 'stretch',
            borderRadius: 'var(--border-radius-md, 6px)',
            border: '1px solid var(--base-input, #E4E4E7)',
            opacity: 1,
            background: fieldConfig.isInheritedChannelValue ? 'var(--base-background, #FFF)' : 'var(--base-muted, #F4F4F5)',
            flex: 1,
            ...(fieldConfig.isInheritedChannelValue ? { pointerEvents: 'none' } : {}),
          }}
        >
          <span style={{
            overflow: 'hidden',
            color: 'var(--base-muted-foreground, #71717A)',
            textOverflow: 'ellipsis',
            fontFamily: 'var(--typography-font-family-font-sans, Inter)',
            fontSize: 'var(--typography-base-sizes-small-font-size, 14px)',
            fontStyle: 'normal',
            fontWeight: 'var(--font-weight-normal, 400)',
            lineHeight: 'var(--typography-base-sizes-small-line-height, 20px)',
          }}>
            {selectedCount > 0 ? `${selectedCount} option${selectedCount !== 1 ? 's' : ''} selected` : fieldConfig.placeholder}
          </span>
        </div>
      )
    }

    return (
      <div className="flex-1">
        <MultiSelect
          options={fieldConfig.options}
          value={Array.isArray(value) ? value : []}
          onValueChange={(newValue) => handleFieldChange(fieldConfig.key, newValue)}
          placeholder={fieldConfig.placeholder}
        />
      </div>
    )
  }

  if (fieldConfig.type === 'radio-tiles') {
    return (
      <div className="flex-1" style={fieldConfig.isInheritedChannelValue ? { opacity: 1, pointerEvents: 'none' } : {}}>
        <RadioTiles
          options={fieldConfig.options}
          value={value}
          onValueChange={(newValue) => handleFieldChange(fieldConfig.key, newValue)}
          disabled={fieldConfig.disabled || fieldConfig.readonly || fieldConfig.isInheritedChannelValue}
        />
      </div>
    )
  }

    if (fieldConfig.type === 'price') {
    return (
      <div className="flex-1 flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(fieldConfig.key, e.target.value)}
            placeholder={fieldConfig.placeholder}
            className="flex-1 pr-12"
            required={fieldConfig.required}
            disabled={fieldConfig.isInheritedChannelValue || fieldConfig.readonly}
            style={fieldConfig.isInheritedChannelValue ? DISABLED_INPUT_STYLE : fieldConfig.readonly ? READONLY_INPUT_STYLE : {}}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">Euro</span>
        </div>
      </div>
    )
  }

  if (fieldConfig.type === 'speed') {
    return (
      <div className="flex-1 flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(fieldConfig.key, e.target.value)}
            placeholder={fieldConfig.placeholder}
            className="flex-1 pr-12"
            required={fieldConfig.required}
            disabled={fieldConfig.isInheritedChannelValue || fieldConfig.readonly}
            style={fieldConfig.isInheritedChannelValue ? DISABLED_INPUT_STYLE : fieldConfig.readonly ? READONLY_INPUT_STYLE : {}}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">MB/s</span>
        </div>
      </div>
    )
  }

  if (fieldConfig.type === 'date') {
    return (
      <Input
        type="date"
        value={value || ''}
        onChange={(e) => handleFieldChange(fieldConfig.key, e.target.value)}
        placeholder={fieldConfig.placeholder}
        className="flex-1"
        required={fieldConfig.required}
        disabled={fieldConfig.disabled || fieldConfig.readonly}
        style={fieldConfig.disabled && isInheritedChannelValue ? DISABLED_INPUT_STYLE : fieldConfig.readonly ? {
          backgroundColor: '#F4F4F5',
          color: 'var(--base-muted-foreground, #71717A)',
          cursor: 'default',
        } : {}}
      />
    )
  }

  if (fieldConfig.type === 'daterange') {
    const fromValue = getProductFieldValue(fieldConfig.fields[0])
    const untilValue = getProductFieldValue(fieldConfig.fields[1])

    return (
      <div className="flex-1 flex gap-3 items-center">
        <input
          type="date"
          value={fromValue || ''}
          onChange={(e) => handleFieldChange(fieldConfig.fields[0], e.target.value)}
          disabled={fieldConfig.disabled || fieldConfig.readonly}
          className="flex-1 px-3 py-2 border border-[#E4E4E7] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={fieldConfig.disabled && isInheritedChannelValue ? DISABLED_INPUT_STYLE : fieldConfig.readonly ? {
            backgroundColor: '#F4F4F5',
            color: 'var(--base-muted-foreground, #71717A)',
            cursor: 'default',
          } : {}}
        />
        <input
          type="date"
          value={untilValue || ''}
          onChange={(e) => handleFieldChange(fieldConfig.fields[1], e.target.value)}
          disabled={fieldConfig.disabled || fieldConfig.readonly}
          className="flex-1 px-3 py-2 border border-[#E4E4E7] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={fieldConfig.disabled && isInheritedChannelValue ? DISABLED_INPUT_STYLE : fieldConfig.readonly ? {
            backgroundColor: '#F4F4F5',
            color: 'var(--base-muted-foreground, #71717A)',
            cursor: 'default',
          } : {}}
        />
      </div>
    )
  }

  // Default text field
  return (
    <Input
      type="text"
      value={value}
      onChange={(e) => handleFieldChange(fieldConfig.key, e.target.value)}
      placeholder={fieldConfig.placeholder}
      className="flex-1"
      required={fieldConfig.required}
      readOnly={fieldConfig.readonly}
      style={{
        ...(fieldConfig.isInheritedChannelValue ? DISABLED_INPUT_STYLE : {}),
        ...(fieldConfig.isInheritedChannelValue ? { pointerEvents: 'none' } : {}),
        ...(value && fieldConfig.key === 'variantName' && !fieldConfig.readonly && !fieldConfig.isInheritedChannelValue ? {
          overflow: 'hidden',
          color: 'var(--base-foreground, #18181B)',
          textOverflow: 'ellipsis',
          fontFamily: 'var(--typography-font-family-font-sans, Inter)',
          fontSize: 'var(--typography-base-sizes-small-font-size, 14px)',
          fontStyle: 'normal',
          fontWeight: 'var(--font-weight-normal, 400)',
          lineHeight: 'var(--typography-base-sizes-small-line-height, 20px)',
        } : {}),
        ...(fieldConfig.readonly && !fieldConfig.isInheritedChannelValue ? {
          backgroundColor: '#F4F4F5',
          color: 'var(--base-muted-foreground, #71717A)',
          cursor: 'default',
        } : {}),
      }}
    />
  )
}

/**
 * Get copy mode message
 */
export const getCopyModeMessage = (mode) => {
  const messages = {
    'variants': 'Values successfully copied to all variants',
    'channels': 'Values successfully copied to all channels',
    'all': 'Values successfully copied to all variants'
  }
  return messages[mode] || 'Values successfully copied'
}
