import React, { createContext, useState, useCallback, useContext } from 'react'

const ProductContext = createContext()

const ARRAY_FIELDS = new Set(['ean', 'pros', 'cons', 'productImages', 'videoReviews', 'suitableForGender', 'boxContents'])
export const SUPPORTED_LANGUAGES = ['English', 'German', 'Dutch', 'French', 'Italian']

const VARIANT_MPC_SUFFIXES = {
  '128 Black': '01',
  '256 Black': '02',
  '128 Blue': '03',
  '256 Blue': '04',
  '128 Orange': '05',
  '256 Orange': '06',
  '128 Pink': '07',
}

const generateMPCIdentifier = (variant) => {
  const suffix = VARIANT_MPC_SUFFIXES[variant] || '00'
  return `ajhkdjhNN11__WW${suffix}`
}

export function ProductProvider({ children }) {
  // Variant Selector State
  const [variant, setVariant] = useState('128 Black')
  const [channel, setChannel] = useState('Belsimpel.nl')
  const [language, setLanguage] = useState('English')
  const [activeTab, setActiveTab] = useState('default') // 'default' or 'channel-specific'
  const [attributeFilter, setAttributeFilter] = useState('all')
  
  // Helper to generate variant-channel key
  const getVariantChannelKey = useCallback((v = variant, c = channel) => {
    // In default tab, use empty channel; in channel-specific, use actual channel
    const effectiveChannel = activeTab === 'default' ? '' : (c || channel)
    return `${v}_${effectiveChannel}`
  }, [variant, channel, activeTab])

  // Helper to generate variant-channel-language key
  const getVariantChannelLanguageKey = useCallback((v = variant, c = channel, l = language) => {
    // In default tab, use empty channel; in channel-specific, use actual channel
    const effectiveChannel = activeTab === 'default' ? '' : (c || channel)
    return `${v}_${effectiveChannel}_${l}`
  }, [variant, channel, language, activeTab])

  // Product Data State
  const [productData, setProductData] = useState({
    // MPC Identifier
    mpcIdentifier: { variantChannelValues: {}, differsOn: null },

    // Product Information
    variantName: { variantChannelValues: {}, differsOn: 'variant-channel-language' },
    brand: { variantChannelValues: {}, differsOn: null },
    ean: { variantChannelValues: {}, differsOn: 'variant' },
    
    // Product Specifications
    returnOldProductFree: { variantChannelValues: {}, differsOn: null },
    suitableForGender: { variantChannelValues: {}, differsOn: null },
    recommendedRetailPrice: { variantChannelValues: {}, differsOn: 'variant-channel' },
    pros: { variantChannelValues: {}, differsOn: 'variant-channel-language' },
    cons: { variantChannelValues: {}, differsOn: 'variant-channel-language' },
    
    // Product Description
    productDescription: { variantChannelValues: {}, differsOn: 'variant-channel-language' },
    
    // General Features
    boxContents: { variantChannelValues: {}, differsOn: null },
    builtInMicrophone: { variantChannelValues: {}, differsOn: null },
    
    // Images and Media
    productImages: { variantChannelValues: {}, differsOn: 'variant' },
    videoReviews: { variantChannelValues: {}, differsOn: 'variant-channel-language' },
  })

  const getProductFieldValue = useCallback((field) => {
    // Special handling for mpcIdentifier
    if (field === 'mpcIdentifier') {
      return generateMPCIdentifier(variant)
    }

    const fieldData = productData[field]
    if (!fieldData) return ''

    // Global attributes use single shared key
    const isGlobal = !fieldData.differsOn
    if (isGlobal) {
      const value = fieldData.variantChannelValues['_']
      if (value === undefined || value === null) {
        return ARRAY_FIELDS.has(field) ? [''] : ''
      }
      return value
    }

    // Use language-keyed value for language-specific fields
    const isLanguageField = fieldData.differsOn?.includes('language')

    // In default tab, use empty channel; in channel-specific, use actual channel
    const effectiveChannel = activeTab === 'default' ? '' : channel
    const key = isLanguageField ? `${variant}_${effectiveChannel}_${language}` : `${variant}_${effectiveChannel}`

    let value = fieldData.variantChannelValues[key]

    // Fallback to default value in channel-specific tab if not set
    if ((value === undefined || value === null) && activeTab === 'channel-specific') {
      const defaultKey = isLanguageField ? `${variant}__${language}` : `${variant}_`
      value = fieldData.variantChannelValues[defaultKey]
    }

    if (value === undefined || value === null) {
      return ARRAY_FIELDS.has(field) ? [''] : ''
    }
    return value
  }, [productData, variant, channel, language, activeTab])

  const updateProductField = useCallback((field, value) => {
    setProductData(prev => {
      const fieldData = prev[field] || { variantChannelValues: {}, differsOn: null }

      // Global attributes use single shared key across all variants/channels/languages
      const isGlobal = !fieldData.differsOn
      const key = isGlobal ? '_' : null

      if (isGlobal) {
        return {
          ...prev,
          [field]: {
            ...fieldData,
            variantChannelValues: {
              ...(fieldData?.variantChannelValues || {}),
              [key]: value
            }
          }
        }
      }

      const isLanguageField = fieldData.differsOn?.includes('language')
      const effectiveChannel = activeTab === 'default' ? '' : channel
      const variantChannelKey = isLanguageField ? `${variant}_${effectiveChannel}_${language}` : `${variant}_${effectiveChannel}`

      return {
        ...prev,
        [field]: {
          ...fieldData,
          variantChannelValues: {
            ...(fieldData?.variantChannelValues || {}),
            [variantChannelKey]: value
          }
        }
      }
    })
  }, [variant, channel, language, activeTab])

  const updateProductFieldTranslations = useCallback((field, translations) => {
    setProductData(prev => {
      const fieldData = prev[field] || { variantChannelValues: {}, differsOn: null }

      // Global attributes don't have language variations
      const isGlobal = !fieldData.differsOn
      if (isGlobal) return prev

      const updatedValues = { ...fieldData.variantChannelValues }

      // Update each language translation
      const effectiveChannel = activeTab === 'default' ? '' : channel
      Object.entries(translations).forEach(([lang, value]) => {
        const key = `${variant}_${effectiveChannel}_${lang}`
        updatedValues[key] = value
      })

      return {
        ...prev,
        [field]: {
          ...fieldData,
          variantChannelValues: updatedValues
        }
      }
    })
  }, [variant, channel, activeTab])

  const markFieldAsCopied = useCallback((field, copyMode) => {
    const fieldData = productData[field]
    if (!fieldData) return

    // Global attributes are already shared across all variants/channels, no need to copy
    const isGlobal = !fieldData.differsOn
    if (isGlobal) return

    const isLanguageField = fieldData.differsOn?.includes('language')
    const effectiveChannel = activeTab === 'default' ? '' : channel

    const currentKey = isLanguageField ? `${variant}_${effectiveChannel}_${language}` : `${variant}_${effectiveChannel}`
    const currentValue = fieldData.variantChannelValues?.[currentKey]

    if (currentValue === undefined || currentValue === null) {
      return
    }

    setProductData(prev => {
      const updated = { ...prev }
      const fieldData = updated[field]

      if (!fieldData) {
        return prev
      }

      if (!fieldData.variantChannelValues) {
        fieldData.variantChannelValues = {}
      }

      const VARIANTS = ['128 Black', '256 Black', '128 Blue', '256 Blue', '128 Orange', '256 Orange', '128 Pink']
      const CHANNELS = ['Belsimpel.nl', 'Gomibo.hu', 'Gomibo.pl', 'Gomibo.be', 'Gomibo.ie', 'Gomibo.pt', 'Gomibo.bg', 'Gomibo.it', 'Gomibo.ro', 'Gomibo.cy', 'Gomibo.hr', 'Gomibo.si', 'Gomibo.dk', 'Gomibo.lv', 'Gomibo.sk', 'Gomibo.de', 'Gomibo.lt', 'Gomibo.es', 'Gomibo.ee', 'Gomibo.lu', 'Gomibo.cz', 'Gomibo.fi', 'Gomibo.mt', 'Gomibo.co.uk', 'Gomibo.fr', 'Gomibo.no', 'Gomibo.se', 'Gomibo.gr', 'Gomibo.at', 'Gomibo.ch']

      const keysToUpdate = []

      if (copyMode === 'variants') {
        VARIANTS.forEach(v => {
          if (isLanguageField) {
            keysToUpdate.push(`${v}_${effectiveChannel}_${language}`)
          } else {
            keysToUpdate.push(`${v}_${effectiveChannel}`)
          }
        })
      } else if (copyMode === 'channels') {
        CHANNELS.forEach(c => {
          if (isLanguageField) {
            keysToUpdate.push(`${variant}_${c}_${language}`)
          } else {
            keysToUpdate.push(`${variant}_${c}`)
          }
        })
      } else if (copyMode === 'all') {
        VARIANTS.forEach(v => {
          CHANNELS.forEach(c => {
            if (isLanguageField) {
              keysToUpdate.push(`${v}_${c}_${language}`)
            } else {
              keysToUpdate.push(`${v}_${c}`)
            }
          })
        })
      }

      keysToUpdate.forEach(key => {
        fieldData.variantChannelValues[key] = currentValue
      })

      return updated
    })
  }, [variant, channel, language, activeTab, productData])

  const handleVariantChange = useCallback((newVariant) => {
    setVariant(newVariant)
  }, [])

  const handleChannelChange = useCallback((newChannel) => {
    setChannel(newChannel)
  }, [])

  const handleLanguageChange = useCallback((newLanguage) => {
    setLanguage(newLanguage)
  }, [])

  const getDefaultValue = useCallback((field) => {
    if (field === 'mpcIdentifier') {
      return generateMPCIdentifier(variant)
    }

    const fieldData = productData[field]
    if (!fieldData) return ''

    // Global attributes use single shared key
    const isGlobal = !fieldData.differsOn
    if (isGlobal) {
      const value = fieldData.variantChannelValues['_']
      if (value === undefined || value === null) {
        return ARRAY_FIELDS.has(field) ? [''] : ''
      }
      return value
    }

    const isLanguageField = fieldData.differsOn?.includes('language')
    const defaultKey = isLanguageField ? `${variant}__${language}` : `${variant}_`

    const value = fieldData.variantChannelValues[defaultKey]
    if (value === undefined || value === null) {
      return ARRAY_FIELDS.has(field) ? [''] : ''
    }
    return value
  }, [productData, variant, language])

  const isValueConnected = useCallback((field) => {
    const currentValue = getProductFieldValue(field)
    const defaultValue = getDefaultValue(field)

    if (Array.isArray(currentValue) && Array.isArray(defaultValue)) {
      return JSON.stringify(currentValue) === JSON.stringify(defaultValue)
    }
    return currentValue === defaultValue
  }, [getProductFieldValue, getDefaultValue])

  const restoreChannelValue = useCallback((field) => {
    const defaultValue = getDefaultValue(field)
    updateProductField(field, defaultValue)
  }, [getDefaultValue, updateProductField])

  const resetProductData = useCallback(() => {
    setProductData(prev => {
      const reset = {}
      Object.keys(prev).forEach(key => {
        reset[key] = {
          variantChannelValues: {},
          differsOn: prev[key].differsOn
        }
      })
      return reset
    })
  }, [])

  const getFieldLanguageValues = useCallback((field) => {
    const fieldData = productData[field]
    if (!fieldData) return {}

    const effectiveChannel = activeTab === 'default' ? '' : channel
    const isLanguageField = fieldData.differsOn?.includes('language')

    if (!isLanguageField) return {}

    const languageValues = {}
    SUPPORTED_LANGUAGES.forEach(lang => {
      const key = `${variant}_${effectiveChannel}_${lang}`
      const value = fieldData.variantChannelValues[key]
      if (value !== undefined && value !== null) {
        languageValues[lang] = value
      }
    })
    return languageValues
  }, [productData, variant, channel, activeTab])

  const value = {
    variant,
    channel,
    language,
    activeTab,
    setActiveTab,
    attributeFilter,
    setAttributeFilter,
    handleVariantChange,
    handleChannelChange,
    handleLanguageChange,
    productData,
    updateProductField,
    getProductFieldValue,
    markFieldAsCopied,
    updateProductFieldTranslations,
    getDefaultValue,
    isValueConnected,
    restoreChannelValue,
    resetProductData,
    getFieldLanguageValues,
  }

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}

export function useProduct() {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProduct must be used within ProductProvider')
  }
  return context
}
