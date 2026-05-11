import { useState, useEffect, useRef, useCallback } from 'react'
import { useProduct, SUPPORTED_LANGUAGES } from '../../context/ProductContext2'
import { PRODUCT_CARDS, DIFF_LABELS } from '../../constants/productCards'
import { Button } from './button'
import { Input } from './input'
import { Combobox } from './combobox'
import { TooltipProvider } from '.'
import Toast from './Toast'
import Skeleton from './Skeleton'
import FormRow from './FormRow'
import CopyAction from './CopyAction'
// import TranslateAction from './TranslateAction'
import LinkAction from './LinkAction'
import CopyToChannelsAction from './CopyToChannelsAction'
import RichTextEditor from './RichTextEditor'
import AttributeBadge from './AttributeBadge'
import { LinkIcon, UnlinkIcon, ClipboardIcon, TrashIcon } from './Icons'
import { renderField, getCopyModeMessage, READONLY_INPUT_STYLE, DISABLED_INPUT_STYLE, isValueEmpty } from '../../utils/formHelpers'

export default function ProductInformation() {
  const { productData, updateProductField, getProductFieldValue, markFieldAsCopied, updateProductFieldTranslations, variant, channel, language, activeTab, getDefaultValue, isValueConnected, restoreChannelValue, attributeFilter, getFieldLanguageValues } = useProduct()
  const [showToast, setShowToast] = useState(false)
  const [toast, setToast] = useState({ message: 'Values successfully copied', variant: 'success' })
  const [isLoading, setIsLoading] = useState(false)
  const [showSystemNotification, setShowSystemNotification] = useState(false)
  const [systemNotificationMessage, setSystemNotificationMessage] = useState('')
  const prevValuesRef = useRef({ variant, channel, language })

  // Auto-fill disabled - start with empty fields

  useEffect(() => {
    const prev = prevValuesRef.current
    let changeMessage = ''

    if (prev.variant !== variant) {
      changeMessage = `You are now editing ${variant}`
    } else if (prev.channel !== channel) {
      changeMessage = `You are now editing on ${channel}`
    } else if (prev.language !== language) {
      changeMessage = `You are now editing in ${language}`
    }

    if (changeMessage) {
      setIsLoading(true)
      setSystemNotificationMessage(changeMessage)

      const timer = setTimeout(() => {
        setIsLoading(false)
        setShowSystemNotification(true)
      }, 1500)

      const hideTimer = setTimeout(() => {
        setShowSystemNotification(false)
      }, 5500)

      prevValuesRef.current = { variant, channel, language }

      return () => {
        clearTimeout(timer)
        clearTimeout(hideTimer)
      }
    }
  }, [variant, channel, language])

  const handleFieldChange = useCallback((field, value) => {
    updateProductField(field, value)
  }, [updateProductField])

  const handleArrayFieldChange = useCallback((field, index, value) => {
    const currentArray = getProductFieldValue(field)
    const newArray = [...currentArray]
    newArray[index] = value
    updateProductField(field, newArray)
  }, [getProductFieldValue, updateProductField])

  const handleAddArrayField = useCallback((field) => {
    const currentArray = getProductFieldValue(field)
    updateProductField(field, [...currentArray, ''])
  }, [getProductFieldValue, updateProductField])

  const handleRemoveArrayField = useCallback((field, index) => {
    const currentArray = getProductFieldValue(field)
    const newArray = currentArray.filter((_, i) => i !== index)
    updateProductField(field, newArray)
  }, [getProductFieldValue, updateProductField])

  const triggerToast = useCallback((message, variant = 'success') => {
    setToast({ message, variant })
    setTimeout(() => setShowToast(true), 300)
  }, [])

  const handleCopyConfirm = useCallback((field, copyMode) => {
    markFieldAsCopied(field, copyMode)
    const message = getCopyModeMessage(copyMode)
    triggerToast(message, 'success')
  }, [markFieldAsCopied, triggerToast])

  const handleCopyToClipboard = useCallback((value) => {
    navigator.clipboard.writeText(value).then(() => {
      triggerToast('Value copied to clipboard', 'system')
    }).catch(() => {
      triggerToast('Failed to copy to clipboard', 'system')
    })
  }, [triggerToast])

  const handleChangeToChannelSpecific = useCallback((field) => {
    const fieldData = productData[field]
    const isLanguageField = fieldData?.differsOn?.includes('language')
    const fieldDef = PRODUCT_CARDS.flatMap(c => c.fields).find(f => f.key === field)
    const emptyValue = fieldDef?.type === 'text-array' ? [''] : ''

    if (isLanguageField) {
      // Write empty to channel-specific key for ALL languages so isValueConnected becomes false
      const emptyTranslations = SUPPORTED_LANGUAGES.reduce((acc, lang) => {
        acc[lang] = emptyValue
        return acc
      }, {})
      updateProductFieldTranslations(field, emptyTranslations)
    } else {
      updateProductField(field, emptyValue)
    }

    triggerToast('Field changed to channel specific value', 'success')
  }, [productData, updateProductField, updateProductFieldTranslations, triggerToast])

  const isChannelSpecific = useCallback((field) => {
    return field.differsOn && field.differsOn.includes('channel')
  }, [])

  const isTranslatable = useCallback((field) => {
    return field.differsOn && field.differsOn.includes('language')
  }, [])

  const handleTranslateConfirm = useCallback((field, translations) => {
    updateProductFieldTranslations(field, translations)
    const languageCount = Object.keys(translations).length
    const message = `Value successfully translated to ${languageCount} language${languageCount !== 1 ? 's' : ''}`
    triggerToast(message, 'success')
  }, [updateProductFieldTranslations, triggerToast])

  const renderFieldElement = useCallback((field) => {
    return renderField(field, getProductFieldValue(field.key), handleFieldChange, handleArrayFieldChange, handleAddArrayField, getProductFieldValue)
  }, [handleFieldChange, handleArrayFieldChange, handleAddArrayField, getProductFieldValue])

  const shouldShowField = useCallback((field) => {
    if (attributeFilter === 'all') return true
    if (attributeFilter === 'required') return !!field.required
    if (attributeFilter === 'channel') return field.differsOn?.includes('channel') ?? false
    if (attributeFilter === 'global') return !field.differsOn
    return true
  }, [attributeFilter])

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex justify-center w-full">
        {showToast && (
          <Toast
            message={toast.message}
            onClose={() => setShowToast(false)}
            variant={toast.variant}
          />
        )}

        {showSystemNotification && (
          <Toast
            message={systemNotificationMessage}
            onClose={() => setShowSystemNotification(false)}
            variant="system"
            duration={4000}
          />
        )}

        <div className="flex flex-col gap-6 w-full max-w-full">
          {PRODUCT_CARDS.map((card, cardIndex) => {
            // For numbering, skip special cards (like mpc-identifier)
            const regularCardIndex = PRODUCT_CARDS.filter((c, i) => !c.isSpecial && i <= cardIndex).length
            
            const visibleFields = card.fields.filter(field => shouldShowField(field))
            if (visibleFields.length === 0) return null

            return (
              <div
                key={card.id}
                id={card.id}
                className={`relative flex flex-col items-start gap-6 rounded-[6px] border border-[#E4E4E7] bg-white ${card.isSpecial ? 'p-0 border-0 bg-transparent' : ''} ${card.id === 'mpc-identifier' ? 'py-4 px-8' : 'p-8'}`}
              >
                {isLoading ? (
                  <div className="flex flex-col gap-6 w-full">
                    <Skeleton className="h-7 w-72" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : (
                  <>
                    {!card.isSpecial && !card.hideTitle && <h2 className="text-xl font-semibold">{card.title}</h2>}

                    <div className="w-full flex flex-col gap-6">
                      {visibleFields.map((field) => {

                        const shouldBeReadonly = activeTab === 'channel-specific' && (!field.differsOn || (!field.differsOn.includes('variant') && !field.differsOn.includes('channel')))
                        const isInheritedChannelValue = activeTab === 'channel-specific' && !!field.differsOn && !field.readonly && isValueConnected(field.key)
                        const defaultIsEmpty = activeTab === 'channel-specific' && isValueEmpty(getDefaultValue(field.key))
                        const fieldConfig = {
                          ...field,
                          placeholder: defaultIsEmpty ? 'No default value yet' : field.placeholder,
                          readonly: shouldBeReadonly ? true : field.readonly,
                          isInheritedChannelValue: isInheritedChannelValue
                        }

                        if (fieldConfig.type === 'text-array') {
                          const arrayValue = getProductFieldValue(field.key)
                          return (
                            <div key={field.key} className="flex-1">
                              <div className="flex gap-4 w-full">
                                <label className="flex w-[200px] h-10 items-center text-sm font-medium text-gray-700">
                                  {field.label}
                                  {field.required && <span className="text-red-500">*</span>}
                                </label>
                                <div className="flex-1 flex flex-col gap-2">
                                  {arrayValue.map((item, index) => (
                                    <div key={index} className="w-full flex items-center gap-3 h-10">
                                      <div className="flex-1 h-10">
                                        <Input
                                          type="text"
                                          value={item}
                                          onChange={(e) => handleArrayFieldChange(field.key, index, e.target.value)}
                                          placeholder={fieldConfig.placeholder}
                                          className="flex-1"
                                          required={field.required}
                                          readOnly={fieldConfig.readonly || fieldConfig.isInheritedChannelValue}
                                          style={{
                                            ...(fieldConfig.isInheritedChannelValue ? { ...DISABLED_INPUT_STYLE, pointerEvents: 'none' } : {}),
                                            ...(fieldConfig.readonly && !fieldConfig.isInheritedChannelValue ? READONLY_INPUT_STYLE : {}),
                                          }}
                                        />
                                      </div>
                                      {index === 0 && !card.isSpecial && (
                                        <div className="flex items-center gap-[var(--Gap-2,8px)] shrink-0">
                                          {field.differsOn ? (
                                            <>
                                              {activeTab === 'default' && (
                                                <>
                                                  <CopyAction
                                                    field={field.key}
                                                    onCopyConfirm={handleCopyConfirm}
                                                    disabled={isValueEmpty(getProductFieldValue(field.key))}
                                                    icon={<ClipboardIcon />}
                                                  />
                                                  <div className="h-10 border-l border-[#E4E4E7]"></div>
                                                </>
                                              )}
                                              {activeTab === 'channel-specific' && (
                                                <>
                                                  <LinkAction
                                                    field={field.key}
                                                    currentValue={getProductFieldValue(field.key)}
                                                    defaultValue={getDefaultValue(field.key)}
                                                    isConnected={isValueConnected(field.key)}
                                                    onRestore={restoreChannelValue}
                                                    onChangeToChannelSpecific={handleChangeToChannelSpecific}
                                                    disabled={isValueConnected(field.key) ? isValueEmpty(getProductFieldValue(field.key)) : false}
                                                  />
                                                  {isChannelSpecific(field) ? (
                                                    <CopyToChannelsAction
                                                      icon={<ClipboardIcon />}
                                                      field={field.key}
                                                      onCopyConfirm={handleCopyConfirm}
                                                      disabled={isValueConnected(field.key) || isValueEmpty(getProductFieldValue(field.key))}
                                                    />
                                                  ) : (
                                                    <div className="h-10 w-10 shrink-0"></div>
                                                  )}
                                                  <div className="h-10 border-l border-[#E4E4E7]"></div>
                                                </>
                                              )}
                                              <AttributeBadge differsOn={field.differsOn} diffLabels={DIFF_LABELS} />
                                            </>
                                          ) : (
                                            <>
                                              {activeTab === 'channel-specific' && <div className="h-10 w-10 shrink-0"></div>}
                                              <div className="h-10 w-10 shrink-0"></div>
                                              <div className="h-10 w-px"></div>
                                              <div className="h-10 w-12 shrink-0"></div>
                                            </>
                                          )}
                                        </div>
                                      )}
                                      {index > 0 && !card.isSpecial && activeTab !== 'channel-specific' && (
                                        <div className="flex items-center gap-[var(--Gap-2,8px)] shrink-0">
                                          <button
                                            onClick={() => handleRemoveArrayField(field.key, index)}
                                            disabled={fieldConfig.readonly || fieldConfig.isInheritedChannelValue}
                                            style={{
                                              borderRadius: 'var(--border-radius-md, 6px)',
                                              border: '1px solid var(--base-input, #E4E4E7)',
                                              display: 'flex',
                                              width: '40px',
                                              height: '40px',
                                              justifyContent: 'center',
                                              alignItems: 'center',
                                              background: 'white',
                                              cursor: fieldConfig.readonly ? 'not-allowed' : 'pointer',
                                            }}
                                            className="shrink-0"
                                          >
                                            <TrashIcon />
                                          </button>
                                          <div className="h-10 w-px"></div>
                                          <div className="h-10 w-12 shrink-0"></div>
                                        </div>
                                      )}
                                      {index > 0 && !card.isSpecial && activeTab === 'channel-specific' && fieldConfig.isInheritedChannelValue && (
                                        <div className="flex items-center gap-[var(--Gap-2,8px)] shrink-0">
                                          <div className="h-10 w-10 shrink-0"></div>
                                          <div className="h-10 w-10 shrink-0"></div>
                                          <div className="h-10 w-px"></div>
                                          <div className="h-10 w-12 shrink-0"></div>
                                        </div>
                                      )}
                                      {index > 0 && !card.isSpecial && activeTab === 'channel-specific' && !fieldConfig.isInheritedChannelValue && (
                                        <div className="flex items-center gap-[var(--Gap-2,8px)] shrink-0">
                                          <button
                                            onClick={() => handleRemoveArrayField(field.key, index)}
                                            style={{
                                              borderRadius: 'var(--border-radius-md, 6px)',
                                              border: '1px solid var(--base-input, #E4E4E7)',
                                              display: 'flex',
                                              width: '40px',
                                              height: '40px',
                                              justifyContent: 'center',
                                              alignItems: 'center',
                                              background: 'white',
                                              cursor: 'pointer',
                                            }}
                                            className="shrink-0"
                                          >
                                            <TrashIcon />
                                          </button>
                                          <div className="h-10 w-10 shrink-0"></div>
                                          <div className="h-10 w-px"></div>
                                          <div className="h-10 w-12 shrink-0"></div>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                  <Button size="sm" variant="outline" onClick={() => handleAddArrayField(fieldConfig.key)} disabled={fieldConfig.readonly || fieldConfig.isInheritedChannelValue} className="w-fit">
                                    <span className="text-sm font-medium">+ Add {field.label}</span>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )
                        }


                        if (fieldConfig.type === 'rich-text') {
                          const value = getProductFieldValue(field.key)
                          return (
                            <div key={field.key} className="flex-1">
                              <div style={fieldConfig.isInheritedChannelValue ? { pointerEvents: 'none' } : {}}>
                                <RichTextEditor
                                  value={value || ''}
                                  onChange={(newValue) => handleFieldChange(field.key, newValue)}
                                  placeholder={fieldConfig.placeholder}
                                  disabled={fieldConfig.readonly || fieldConfig.isInheritedChannelValue}
                                />
                              </div>
                              {!card.isSpecial && (
                                <div className="flex items-center gap-[var(--Gap-2,8px)] shrink-0 mt-3">
                                  {field.differsOn ? (
                                    <>
                                      {activeTab === 'default' && (
                                        <>
                                          <CopyAction
                                            field={field.key}
                                            onCopyConfirm={handleCopyConfirm}
                                            disabled={!value}
                                            icon={<ClipboardIcon />}
                                          />
                                          <div className="h-10 border-l border-[#E4E4E7]"></div>
                                        </>
                                      )}
                                      {activeTab === 'channel-specific' && (
                                        <>
                                          <LinkAction
                                            field={field.key}
                                            currentValue={value}
                                            defaultValue={getDefaultValue(field.key)}
                                            isConnected={isValueConnected(field.key)}
                                            onRestore={restoreChannelValue}
                                            onChangeToChannelSpecific={handleChangeToChannelSpecific}
                                            disabled={isValueConnected(field.key) ? !value : false}
                                          />
                                          {isChannelSpecific(field) ? (
                                            <CopyToChannelsAction
                                                      icon={<ClipboardIcon />}
                                                      field={field.key}
                                                      onCopyConfirm={handleCopyConfirm}
                                                      disabled={isValueConnected(field.key) || !value}
                                                    />
                                          ) : (
                                            <div className="h-10 w-10 shrink-0"></div>
                                          )}
                                          <div className="h-10 border-l border-[#E4E4E7]"></div>
                                        </>
                                      )}
                                      <AttributeBadge differsOn={field.differsOn} diffLabels={DIFF_LABELS} />
                                    </>
                                  ) : (
                                    <>
                                      <div className="h-10 w-10 shrink-0"></div>
                                      <div className="h-10 w-px"></div>
                                      <div className="h-10 w-12 shrink-0"></div>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        }


                        return (
                          <div key={field.key} className="flex-1">
                            <FormRow label={field.label} required={field.required}>
                              <div className="flex-1 flex items-center gap-3 h-10">
                                <div className="flex-1 h-10">
                                  {renderFieldElement(fieldConfig)}
                                </div>
                                {!card.isSpecial && (
                                  <div className="flex items-center h-10 gap-[var(--Gap-2,8px)] shrink-0">
                                    {field.differsOn ? (
                                      <>
                                        {(activeTab === 'default' || field.readonly) && (
                                          <>
                                            {field.key === 'mpcIdentifier' ? (
                                              <button
                                                onClick={() => handleCopyToClipboard(getProductFieldValue(field.key))}
                                                disabled={!getProductFieldValue(field.key)}
                                                style={{
                                                  borderRadius: 'var(--border-radius-md, 6px)',
                                                  border: '1px solid var(--base-input, #E4E4E7)',
                                                  display: 'flex',
                                                  width: '40px',
                                                  height: '40px',
                                                  justifyContent: 'center',
                                                  alignItems: 'center',
                                                  background: 'white',
                                                  cursor: !getProductFieldValue(field.key) ? 'not-allowed' : 'pointer',
                                                  opacity: !getProductFieldValue(field.key) ? 0.5 : 1,
                                                }}
                                                className="shrink-0"
                                                title="Copy to clipboard"
                                              >
                                                <ClipboardIcon />
                                              </button>
                                            ) : (
                                              <CopyAction
                                                field={field.key}
                                                onCopyConfirm={handleCopyConfirm}
                                                disabled={isValueEmpty(getProductFieldValue(field.key))}
                                                icon={<ClipboardIcon />}
                                              />
                                            )}
                                            <div className="h-10 border-l border-[#E4E4E7]"></div>
                                          </>
                                        )}
                                        {activeTab === 'channel-specific' && !field.readonly && (
                                          <>
                                            <LinkAction
                                              field={field.key}
                                              currentValue={getProductFieldValue(field.key)}
                                              defaultValue={getDefaultValue(field.key)}
                                              isConnected={isValueConnected(field.key)}
                                              onRestore={restoreChannelValue}
                                              onChangeToChannelSpecific={handleChangeToChannelSpecific}
                                              disabled={isValueConnected(field.key) ? isValueEmpty(getProductFieldValue(field.key)) : false}
                                            />
                                            {isChannelSpecific(field) ? (
                                              <CopyToChannelsAction
                                                      icon={<ClipboardIcon />}
                                                      field={field.key}
                                                      onCopyConfirm={handleCopyConfirm}
                                                      disabled={isValueConnected(field.key) || isValueEmpty(getProductFieldValue(field.key))}
                                                    />
                                            ) : (
                                              <div className="h-10 w-10 shrink-0"></div>
                                            )}
                                            <div className="h-10 border-l border-[#E4E4E7]"></div>
                                          </>
                                        )}
                                        <AttributeBadge differsOn={field.differsOn} diffLabels={DIFF_LABELS} />
                                      </>
                                    ) : (
                                      <>
                                        {activeTab === 'channel-specific' && <div className="h-10 w-10 shrink-0"></div>}
                                        <div className="h-10 w-10 shrink-0"></div>
                                        <div className="h-10 w-px"></div>
                                        <div className="h-10 w-12 shrink-0"></div>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                            </FormRow>
                          </div>
                        )
                      })}

                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </TooltipProvider>
  )
}
