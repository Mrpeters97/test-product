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
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '.'
import ChangeChannelValueDialog from './ChangeChannelValueDialog'

const LinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <g clipPath="url(#clip0_8339_3866)">
      <path d="M5.99967 11.3327H4.66634C2.82539 11.3327 1.33301 9.8403 1.33301 7.99935C1.33301 6.1584 2.82539 4.66602 4.66634 4.66602H5.99967M9.99967 11.3327H11.333C13.174 11.3327 14.6663 9.8403 14.6663 7.99935C14.6663 6.1584 13.174 4.66602 11.333 4.66602H9.99967M4.66634 7.99935L11.333 7.99935" stroke="#18181B" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <defs>
      <clipPath id="clip0_8339_3866">
        <rect width="16" height="16" fill="white"/>
      </clipPath>
    </defs>
  </svg>
)

const UnlinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M5.33333 0C5.70152 0 6 0.298477 6 0.666667V2C6 2.36819 5.70152 2.66667 5.33333 2.66667C4.96514 2.66667 4.66667 2.36819 4.66667 2V0.666667C4.66667 0.298477 4.96514 0 5.33333 0Z" fill="#18181B"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M9.33333 12C9.70152 12 10 12.2985 10 12.6667V14C10 14.3682 9.70152 14.6667 9.33333 14.6667C8.96514 14.6667 8.66667 14.3682 8.66667 14V12.6667C8.66667 12.2985 8.96514 12 9.33333 12Z" fill="#18181B"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M0.666667 4.66667H2C2.36819 4.66667 2.66667 4.96514 2.66667 5.33333C2.66667 5.70152 2.36819 6 2 6H0.666667C0.298477 6 0 5.70152 0 5.33333C0 4.96514 0.298477 4.66667 0.666667 4.66667Z" fill="#18181B"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 9.33333C12 8.96514 12.2985 8.66667 12.6667 8.66667H14C14.3682 8.66667 14.6667 8.96514 14.6667 9.33333C14.6667 9.70152 14.3682 10 14 10H12.6667C12.2985 10 12 9.70152 12 9.33333Z" fill="#18181B"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M1.19526 1.19526C1.45561 0.934913 1.87772 0.934913 2.13807 1.19526L3.08088 2.13807C3.34123 2.39842 3.34123 2.82053 3.08088 3.08088C2.82053 3.34123 2.39842 3.34123 2.13807 3.08088L1.19526 2.13807C0.934913 1.87772 0.934913 1.45561 1.19526 1.19526Z" fill="#18181B"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M11.5858 11.5858C11.8461 11.3254 12.2682 11.3254 12.5286 11.5858L13.4714 12.5286C13.7318 12.7889 13.7318 13.2111 13.4714 13.4714C13.2111 13.7318 12.7889 13.7318 12.5286 13.4714L11.5858 12.5286C11.3254 12.2682 11.3254 11.8461 11.5858 11.5858Z" fill="#18181B"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M8.27614 1.67648C9.57789 0.374732 11.6884 0.374732 12.9902 1.67648C14.2919 2.97823 14.2919 5.08878 12.9902 6.39052L11.576 7.80474C11.3156 8.06509 10.8935 8.06509 10.6332 7.80474C10.3728 7.54439 10.3728 7.12228 10.6332 6.86193L12.0474 5.44772C12.8284 4.66667 12.8284 3.40034 12.0474 2.61929C11.2663 1.83824 10 1.83824 9.21895 2.61929L7.80474 4.0335C7.54439 4.29385 7.12228 4.29385 6.86193 4.0335C6.60158 3.77315 6.60158 3.35104 6.86193 3.09069L8.27614 1.67648ZM4.0335 6.86193C4.29385 7.12228 4.29385 7.54439 4.0335 7.80474L2.61929 9.21895C1.83824 10 1.83824 11.2663 2.61929 12.0474C3.40034 12.8284 4.66667 12.8284 5.44772 12.0474L6.86193 10.6332C7.12228 10.3728 7.54439 10.3728 7.80474 10.6332C8.06509 10.8935 8.06509 11.3156 7.80474 11.576L6.39052 12.9902C5.08878 14.2919 2.97823 14.2919 1.67648 12.9902C0.374732 11.6884 0.374731 9.57789 1.67648 8.27614L3.09069 6.86193C3.35104 6.60158 3.77315 6.60158 4.0335 6.86193Z" fill="#18181B"/>
  </svg>
)

export default function LinkAction({ field, currentValue, defaultValue, isConnected, onRestore, onChangeToChannelSpecific, disabled }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleRestore = () => {
    onRestore(field, defaultValue)
    setIsOpen(false)
  }

  const handleChangeToChannelSpecific = () => {
    onChangeToChannelSpecific(field)
  }

  return (
    <>
      {isConnected ? (
        <ChangeChannelValueDialog
          field={field}
          onConfirm={handleChangeToChannelSpecific}
          disabled={disabled}
        />
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
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
                  <UnlinkIcon />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Value changed to channel specific value</p>
            </TooltipContent>
          </Tooltip>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Restore default value</DialogTitle>
              <DialogDescription>
                This value has been changed to a specific value for this channel. Would you like to restore this value to the default?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
              <Button
                onClick={handleRestore}
                className="gap-[var(--Gap-2,8px)] rounded-[var(--border-radius-md,6px)] bg-[var(--base-foreground,#18181B)] px-[var(--Gap-4,16px)] py-[var(--Gap-2-5,10px)] text-[#FAFAFA] hover:bg-[var(--base-foreground,#18181B)]/90"
              >
                Restore
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
