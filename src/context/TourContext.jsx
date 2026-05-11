import { createContext, useState, useContext } from 'react'
import { TOUR_STEPS } from '../constants/tourSteps'

const TourContext = createContext()

export const TourProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(0)

  const next = () => {
    setCurrentStep((prev) => {
      if (prev < TOUR_STEPS.length - 1) return prev + 1
      return prev
    })
  }

  const prev = () => {
    setCurrentStep((prev) => {
      if (prev > 0) return prev - 1
      return prev
    })
  }

  const end = () => {
    setCurrentStep(null)
  }

  const start = () => {
    setCurrentStep(0)
  }

  const isActive = currentStep !== null && currentStep < TOUR_STEPS.length

  return (
    <TourContext.Provider
      value={{
        currentStep,
        totalSteps: TOUR_STEPS.length,
        isActive,
        next,
        prev,
        end,
        start,
      }}
    >
      {children}
    </TourContext.Provider>
  )
}

export const useTour = () => {
  const context = useContext(TourContext)
  if (!context) {
    throw new Error('useTour must be used within TourProvider')
  }
  return context
}
