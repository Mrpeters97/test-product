import { PRODUCT_CARDS } from '../constants/productCards'
import { VARIANT_OPTIONS, LANGUAGE_OPTIONS } from '../constants/selectorConfig'
import { isValueEmpty } from './formHelpers'

const VARIANTS = VARIANT_OPTIONS.map((v) => v.value)
const LANGUAGES = LANGUAGE_OPTIONS.map((l) => l.value)

const fieldCardId = {}
for (const card of PRODUCT_CARDS) {
  for (const field of card.fields) {
    fieldCardId[field.key] = card.id
  }
}

export const getCardIdForField = (fieldKey) => fieldCardId[fieldKey]

const slotsForField = (field) => {
  if (!field.differsOn) {
    return [{ variant: null, language: null }]
  }
  if (field.differsOn === 'variant') {
    return VARIANTS.map((variant) => ({ variant, language: null }))
  }
  if (field.differsOn === 'variant-channel') {
    return VARIANTS.map((variant) => ({ variant, language: null }))
  }
  if (field.differsOn === 'variant-language' || field.differsOn === 'variant-channel-language') {
    const out = []
    for (const variant of VARIANTS) {
      for (const language of LANGUAGES) {
        out.push({ variant, language })
      }
    }
    return out
  }
  return [{ variant: null, language: null }]
}

const defaultKey = (field, variant, language) => {
  if (!field.differsOn) return '_'
  const isLang = field.differsOn.includes('language')
  return isLang ? `${variant}__${language}` : `${variant}_`
}

const slotIsFilled = (productData, field, variant, language) => {
  const fieldData = productData[field.key]
  if (!fieldData) return false
  const key = defaultKey(field, variant, language)
  const value = fieldData.variantChannelValues?.[key]
  return !isValueEmpty(value)
}

export const isFieldScored = (field) => {
  if (field.readonly) return false
  if (field.key === 'mpcIdentifier') return false
  return true
}

export const computeCompleteness = (productData) => {
  let totalSlots = 0
  let filledSlots = 0
  const perField = {}

  for (const card of PRODUCT_CARDS) {
    for (const field of card.fields) {
      if (!isFieldScored(field)) continue
      const slots = slotsForField(field)
      const missing = []
      let filled = 0
      for (const slot of slots) {
        if (slotIsFilled(productData, field, slot.variant, slot.language)) {
          filled += 1
        } else {
          missing.push(slot)
        }
      }
      perField[field.key] = {
        field,
        cardId: card.id,
        totalSlots: slots.length,
        filledSlots: filled,
        missingSlots: missing,
        missingCount: missing.length,
      }
      totalSlots += slots.length
      filledSlots += filled
    }
  }

  const percentComplete = totalSlots === 0 ? 100 : Math.round((filledSlots / totalSlots) * 100)

  return { totalSlots, filledSlots, percentComplete, perField }
}

export const groupByRequired = (perField) => {
  const required = []
  const optional = []
  for (const entry of Object.values(perField)) {
    if (entry.missingCount === 0 && entry.field.required) {
      required.push(entry)
      continue
    }
    if (entry.field.required) required.push(entry)
    else optional.push(entry)
  }
  return { required, optional }
}

export const completenessColor = (percent) => {
  if (percent < 25) return '#EF4444'
  if (percent <= 75) return '#F97316'
  return '#22C55E'
}
