import React, { createContext, useState, useCallback } from 'react'

const ProductContext = createContext()

export const ProductProvider = ({ children }) => {
  // Variant Selector State
  const [variant, setVariant] = useState('128-black')
  const [channel, setChannel] = useState('Belsimpel.nl')
  const [language, setLanguage] = useState('English')
  
  // Helper to generate variant-channel key
  const getVariantChannelKey = useCallback((v = variant, c = channel) => {
    return `${v}_${c}`
  }, [variant, channel])

  // Product Data State - now stores values per variant-channel combo
  const [productData, setProductData] = useState({
    // Product specifications
    productIdentifier: { variantChannelValues: {}, differsOn: 'variant' },
    name: { variantChannelValues: {}, differsOn: 'variant-channel-language' },
    provider: { variantChannelValues: {}, differsOn: null },
    validFrom: { variantChannelValues: {}, differsOn: null },
    validUntil: { variantChannelValues: {}, differsOn: null },
    ean: { variantChannelValues: {}, differsOn: 'channel' },
    brand: { variantChannelValues: {}, differsOn: null },
    
    // Compatibility
    customerSegment: { variantChannelValues: {}, differsOn: null },
    activationType: { variantChannelValues: {}, differsOn: null },
    simType: { variantChannelValues: {}, differsOn: null },
    bundleType: { variantChannelValues: {}, differsOn: null },
    
    // Monthly costs
    regularMonthlyCost: { variantChannelValues: {}, differsOn: 'variant-channel' },
    regularSetupCost: { variantChannelValues: {}, differsOn: 'variant-channel' },
    promotionSetupCost: { variantChannelValues: {}, differsOn: null },
    firstPromotionPrice: { variantChannelValues: {}, differsOn: null },
    firstPromotionPeriod: { variantChannelValues: {}, differsOn: null },
    secondPromotionPrice: { variantChannelValues: {}, differsOn: null },
    
    // Bundle
    postUsageBehaviorData: { variantChannelValues: {}, differsOn: null },
    
    // Network
    maxUploadSpeed: { variantChannelValues: {}, differsOn: null },
    maxDownloadSpeed: { variantChannelValues: {}, differsOn: null },
    networkFrequencyAccess: { variantChannelValues: {}, differsOn: null },
    networkOperator: { variantChannelValues: {}, differsOn: null },
    
    // Pairing codes
    pairingCode: { variantChannelValues: {}, differsOn: null },
    
    // Loyalty discounts
    linkedRegularSubscription: { variantChannelValues: {}, differsOn: null },
    loyaltyBenefits: { variantChannelValues: {}, differsOn: null },
    loyaltyBenefitsRequirements: { variantChannelValues: {}, differsOn: null },
  })

  // Get field value for current variant-channel combo
  const getProductFieldValue = useCallback((field) => {
    const key = getVariantChannelKey()
    const fieldData = productData[field]
    if (!fieldData) return ''
    
    const value = fieldData.variantChannelValues[key]
    // Return stored value or empty string/array based on type
    if (value === undefined || value === null) {
      return fieldData.differsOn === 'channel-local' ? [''] : ''
    }
    return value
  }, [productData, getVariantChannelKey])

  // Update product data field for current variant-channel combo
  const updateProductField = useCallback((field, value) => {
    const key = getVariantChannelKey()
    setProductData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        variantChannelValues: {
          ...prev[field].variantChannelValues,
          [key]: value
        }
      }
    }))
  }, [getVariantChannelKey])

  // Mark field as copied and propagate value based on copy mode
  const markFieldAsCopied = useCallback((field, copyMode) => {
    const currentKey = getVariantChannelKey()
    const currentValue = productData[field]?.variantChannelValues?.[currentKey]
    
    if (currentValue === undefined || currentValue === null || currentValue === '' || (Array.isArray(currentValue) && currentValue.every(v => !v))) {
      return // Don't copy empty values
    }
    
    setProductData(prev => {
      const updated = { ...prev }
      const fieldData = updated[field]
      
      if (!fieldData.variantChannelValues) {
        fieldData.variantChannelValues = {}
      }
      
      const VARIANTS = [
        'Monthly terminable - 1 GB', 'Monthly terminable - Unlimited',
        '1 year terminable - 1 GB', '1 year terminable - Unlimited',
        '2 years terminable - 1 GB', '2 years terminable - Unlimited',
      ]
      
      const CHANNELS = [
        'Belsimpel.nl', 'Gomibo.hu', 'Gomibo.pl', 'Gomibo.be', 'Gomibo.ie', 'Gomibo.pt',
        'Gomibo.bg', 'Gomibo.it', 'Gomibo.ro', 'Gomibo.cy', 'Gomibo.hr', 'Gomibo.si',
        'Gomibo.dk', 'Gomibo.lv', 'Gomibo.sk', 'Gomibo.de', 'Gomibo.lt', 'Gomibo.es',
        'Gomibo.ee', 'Gomibo.lu', 'Gomibo.cz', 'Gomibo.fi', 'Gomibo.mt', 'Gomibo.co.uk',
        'Gomibo.fr', 'Gomibo.no', 'Gomibo.se', 'Gomibo.gr', 'Gomibo.at', 'Gomibo.ch',
      ]
      
      const keysToUpdate = []
      
      if (copyMode === 'variants') {
        // Copy to all variants in current channel
        VARIANTS.forEach(v => {
          keysToUpdate.push(`${v}_${channel}`)
        })
      } else if (copyMode === 'channels') {
        // Copy to all channels for current variant
        CHANNELS.forEach(c => {
          keysToUpdate.push(`${variant}_${c}`)
        })
      } else if (copyMode === 'all') {
        // Copy to all variants and channels
        VARIANTS.forEach(v => {
          CHANNELS.forEach(c => {
            keysToUpdate.push(`${v}_${c}`)
          })
        })
      }
      
      // Update all keys with the current value
      keysToUpdate.forEach(key => {
        fieldData.variantChannelValues[key] = currentValue
      })
      
      return updated
    })
  }, [getVariantChannelKey, variant, channel, productData])

  // Handle variant change - just update state, don't clear (values are per-combo)
  const handleVariantChange = useCallback((newVariant) => {
    setVariant(newVariant)
  }, [])

  // Handle channel change - just update state, don't clear (values are per-combo)
  const handleChannelChange = useCallback((newChannel) => {
    setChannel(newChannel)
  }, [])

  // Handle language change
  const handleLanguageChange = useCallback((newLanguage) => {
    setLanguage(newLanguage)
  }, [])

  const value = {
    // Selector values
    variant,
    channel,
    language,
    
    // Variant selector handlers
    handleVariantChange,
    handleChannelChange,
    handleLanguageChange,
    
    // Product data
    productData,
    updateProductField,
    getProductFieldValue,
    markFieldAsCopied,
  }

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}

export const useProduct = () => {
  const context = React.useContext(ProductContext)
  if (!context) {
    throw new Error('useProduct must be used within ProductProvider')
  }
  return context
}
