import { useEffect } from 'react'

/**
 * Hook to handle auto-filling product fields with defaults
 */
export const useProductAutoFill = (
  variant,
  channel,
  language,
  getProductFieldValue,
  updateProductField
) => {
  // Auto-fill name when variant or language changes and name is empty
  useEffect(() => {
    if (!variant || !language) return
    if (getProductFieldValue('name')) return

    const cleanVariant = variant.replace(/ - /g, ' ')
    const variantMap = {
      'Monthly terminable 1 GB': 'Maandelijks opzegbaar 1 GB',
      'Monthly terminable 5 GB': 'Maandelijks opzegbaar 5 GB',
      'Monthly terminable 10 GB': 'Maandelijks opzegbaar 10 GB',
      '2 year terminable 1 GB': '2 jaar opzegbaar 1 GB',
      '2 year terminable 5 GB': '2 jaar opzegbaar 5 GB',
      '2 year terminable 10 GB': '2 jaar opzegbaar 10 GB',
    }
    
    const generatedName = language === 'Dutch' 
      ? `KPN ${variantMap[cleanVariant] || cleanVariant}`
      : `KPN ${cleanVariant}`
    
    updateProductField('name', generatedName)
  }, [variant, language])

  // Auto-fill default values when variant or channel changes
  useEffect(() => {
    if (!variant && !channel) return

    // Product Identifier
    if (!getProductFieldValue('productIdentifier') && variant) {
      const variantMap = {
        'Monthly terminable - 1 GB': '123456ABCD',
        'Monthly terminable - 5 GB': '123456ABCE',
        'Monthly terminable - 10 GB': '123456ABCF',
        '2 year terminable - 1 GB': '123456ABCG',
        '2 year terminable - 5 GB': '123456ABCH',
        '2 year terminable - 10 GB': '123456ABCI',
      }
      updateProductField('productIdentifier', variantMap[variant] || '')
    }

    // Default selections
    const defaults = {
      provider: 'kpn',
      validFrom: '2026-01-01',
      validUntil: '2026-03-31',
      customerSegment: 'consumer',
      activationType: 'new-number',
      simType: 'physical-sim',
      bundleType: 'sim-only',
      networkOperator: 'kpn',
      maxUploadSpeed: '300',
      maxDownloadSpeed: '300',
      networkFrequencyAccess: '5g',
    }

    Object.entries(defaults).forEach(([field, value]) => {
      if (!getProductFieldValue(field)) {
        updateProductField(field, value)
      }
    })
  }, [variant, channel])

  // Auto-fill monthly costs based on variant
  useEffect(() => {
    if (!variant) return

    const costMap = {
      'Monthly terminable - 1 GB': 11,
      'Monthly terminable - Unlimited': 26,
      '1 year terminable - 1 GB': 10,
      '1 year terminable - Unlimited': 25,
      '2 years terminable - 1 GB': 10,
      '2 years terminable - Unlimited': 25,
    }

    if (!getProductFieldValue('regularSetupCost')) {
      updateProductField('regularSetupCost', 0)
    }

    if (!getProductFieldValue('regularMonthlyCost')) {
      updateProductField('regularMonthlyCost', costMap[variant] || '')
    }
  }, [variant, channel])
}
