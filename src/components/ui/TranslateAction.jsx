import { useState } from 'react'
import { Button } from './button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '.'
import { Input } from './input'
import { SUPPORTED_LANGUAGES } from '../../context/ProductContext2'

const TranslateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
    <path d="M5.33348 0.666667C5.33348 0.298477 5.035 0 4.66681 0C4.29862 0 4.00015 0.298477 4.00015 0.666667V1.33333H0.666814C0.298624 1.33333 0.000147301 1.63181 0.000147301 2C0.000147301 2.36819 0.298624 2.66667 0.666814 2.66667H6.18624C5.87599 3.98313 5.35455 5.19781 4.65086 6.27532C4.05797 5.71877 3.55516 5.0563 3.28092 4.4072C3.13762 4.06804 2.74651 3.90927 2.40735 4.05256C2.06819 4.19586 1.90941 4.58697 2.05271 4.92613C2.42187 5.79986 3.08057 6.65397 3.85002 7.35032C2.90176 8.471 1.72726 9.39522 0.370126 10.0697C0.0404063 10.2335 -0.0940521 10.6336 0.0698044 10.9634C0.233661 11.2931 0.633783 11.4275 0.963502 11.2637C2.50757 10.4963 3.83943 9.44062 4.9092 8.16254C5.18039 8.33583 5.45503 8.48595 5.72694 8.60811C6.06279 8.759 6.45737 8.60906 6.60826 8.27321C6.75915 7.93736 6.60921 7.54278 6.27336 7.39189C6.08673 7.30804 5.89779 7.20688 5.70988 7.0913C6.58234 5.77972 7.21038 4.28645 7.55231 2.66667H8.66681C9.035 2.66667 9.33348 2.36819 9.33348 2C9.33348 1.63181 9.035 1.33333 8.66681 1.33333H7.01116C7.00326 1.33319 6.99539 1.33319 6.98754 1.33333H5.33348V0.666667Z" fill="black"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M10.7683 4.87204C10.4936 4.73938 10.1734 4.73938 9.89863 4.87204C9.65966 4.98744 9.53009 5.18852 9.46572 5.29673C9.39828 5.4101 9.3291 5.55482 9.26114 5.69698L7.34674 9.69982C7.34244 9.70833 7.33832 9.71695 7.33438 9.72567L6.0654 12.379C5.90654 12.7111 6.04703 13.1092 6.37918 13.2681C6.71134 13.4269 7.10939 13.2864 7.26824 12.9543L8.36233 10.6666H12.3046L13.3987 12.9543C13.5576 13.2864 13.9556 13.4269 14.2878 13.2681C14.6199 13.1092 14.7604 12.7111 14.6016 12.379L13.3326 9.72569C13.3287 9.71696 13.3245 9.70833 13.3202 9.6998L11.4058 5.69698C11.3379 5.55484 11.2687 5.41009 11.2013 5.29673C11.1369 5.18852 11.0073 4.98744 10.7683 4.87204ZM10.3335 6.54512L11.667 9.3333H9.00001L10.3335 6.54512Z" fill="black"/>
  </svg>
)

export default function TranslateAction({ field, currentValue, currentLanguage, onTranslateConfirm, disabled, existingLanguageValues = {} }) {
  const [isOpen, setIsOpen] = useState(false)
  const [translations, setTranslations] = useState(existingLanguageValues)

  const otherLanguages = SUPPORTED_LANGUAGES.filter(lang => lang !== currentLanguage)

  const normalizedValue = Array.isArray(currentValue) ? (currentValue[0] || '') : (currentValue || '')
  const isEnglishFilled = (currentLanguage === 'English' && normalizedValue.trim()) || (translations['English'] && translations['English'].trim() !== '')
  const canConfirm = isEnglishFilled

  const handleTranslationChange = (lang, value) => {
    setTranslations(prev => ({
      ...prev,
      [lang]: value
    }))
  }

  const handleConfirm = () => {
    if (!canConfirm) return

    const filledTranslations = Object.fromEntries(
      Object.entries(translations).filter(([_, value]) => value.trim() !== '')
    )

    onTranslateConfirm(field, filledTranslations)
    setIsOpen(false)
    setTranslations({})
  }

  const handleOpenChange = (newOpen) => {
    setIsOpen(newOpen)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          disabled={disabled}
          style={disabled ? {
            borderRadius: 'var(--border-radius-md, 6px)',
            border: '1px solid var(--base-input, #E4E4E7)',
            opacity: 'var(--opacity-opacity-50, 0.5)',
            pointerEvents: 'none',
          } : undefined}
        >
          <TranslateIcon />
        </Button>
      </DialogTrigger>
      <DialogContent hideCloseButton={true}>
        <DialogHeader>
          <DialogTitle>Translate value</DialogTitle>
          <DialogDescription>
            Directly copy this value to other variants. Existing values within those variants will be overwritten and this action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 my-4">
          {/* Current language (readonly) */}
          <div className="space-y-1">
            <label className="text-sm font-medium">{currentLanguage}{currentLanguage === 'English' ? '*' : ''}</label>
            <Input
              value={normalizedValue}
              readOnly
              className="bg-[#F4F4F5] border-[#E4E4E7] cursor-default"
            />
          </div>

          {/* Other languages */}
          {otherLanguages.map((lang, index) => (
            <div key={lang} className="space-y-1">
              <label className="text-sm font-medium">{lang}{lang === 'English' ? '*' : ''}</label>
              <Input
                autoFocus={index === 0}
                placeholder="Translation"
                value={translations[lang] || ''}
                onChange={(e) => handleTranslationChange(lang, e.target.value)}
                className="border-[#E4E4E7]"
              />
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
          <Button
            onClick={handleConfirm}
            disabled={!canConfirm}
            style={!canConfirm ? {
              borderRadius: 'var(--border-radius-md, 6px)',
              opacity: 'var(--opacity-opacity-50, 0.5)',
              background: 'var(--base-foreground, #18181B)',
            } : undefined}
            className="gap-[var(--Gap-2,8px)] rounded-[var(--border-radius-md,6px)] bg-[var(--base-foreground,#18181B)] px-[var(--Gap-4,16px)] py-[var(--Gap-2-5,10px)] text-[#FAFAFA] hover:bg-[var(--base-foreground,#18181B)]/90 disabled:hover:bg-[var(--base-foreground,#18181B)]"
          >
            Translate value
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 15 14" fill="none">
              <path d="M5.33348 0.666667C5.33348 0.298477 5.035 0 4.66681 0C4.29862 0 4.00015 0.298477 4.00015 0.666667V1.33333H0.666814C0.298624 1.33333 0.000147301 1.63181 0.000147301 2C0.000147301 2.36819 0.298624 2.66667 0.666814 2.66667H6.18624C5.87599 3.98313 5.35455 5.19781 4.65086 6.27532C4.05797 5.71877 3.55516 5.0563 3.28092 4.4072C3.13762 4.06804 2.74651 3.90927 2.40735 4.05256C2.06819 4.19586 1.90941 4.58697 2.05271 4.92613C2.42187 5.79986 3.08057 6.65397 3.85002 7.35032C2.90176 8.471 1.72726 9.39522 0.370126 10.0697C0.0404063 10.2335 -0.0940521 10.6336 0.0698044 10.9634C0.233661 11.2931 0.633783 11.4275 0.963502 11.2637C2.50757 10.4963 3.83943 9.44062 4.9092 8.16254C5.18039 8.33583 5.45503 8.48595 5.72694 8.60811C6.06279 8.759 6.45737 8.60906 6.60826 8.27321C6.75915 7.93736 6.60921 7.54278 6.27336 7.39189C6.08673 7.30804 5.89779 7.20688 5.70988 7.0913C6.58234 5.77972 7.21038 4.28645 7.55231 2.66667H8.66681C9.035 2.66667 9.33348 2.36819 9.33348 2C9.33348 1.63181 9.035 1.33333 8.66681 1.33333H7.01116C7.00326 1.33319 6.99539 1.33319 6.98754 1.33333H5.33348V0.666667Z" fill="white"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M10.7683 4.87204C10.4936 4.73938 10.1734 4.73938 9.89863 4.87204C9.65966 4.98744C9.53009 5.18852 9.46572 5.29673C9.39828 5.4101 9.3291 5.55482 9.26114 5.69698L7.34674 9.69982C7.34244 9.70833 7.33832 9.71695 7.33438 9.72567L6.0654 12.379C5.90654 12.7111 6.04703 13.1092 6.37918 13.2681C6.71134 13.4269 7.10939 13.2864 7.26824 12.9543L8.36233 10.6666H12.3046L13.3987 12.9543C13.5576 13.2864 13.9556 13.4269 14.2878 13.2681C14.6199 13.1092 14.7604 12.7111 14.6016 12.379L13.3326 9.72569C13.3287 9.71696 13.3245 9.70833 13.3202 9.6998L11.4058 5.69698C11.3379 5.55484 11.2687 5.41009 11.2013 5.29673C11.1369 5.18852 11.0073 4.98744 10.7683 4.87204ZM10.3335 6.54512L11.667 9.3333H9.00001L10.3335 6.54512Z" fill="white"/>
            </svg>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
