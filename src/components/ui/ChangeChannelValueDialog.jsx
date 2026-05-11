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
import { LinkIcon } from './Icons'

export default function ChangeChannelValueDialog({
  field,
  onConfirm,
  disabled
}) {
  const [isOpen, setIsOpen] = useState(false)

  const handleContinue = () => {
    try {
      onConfirm(field)
    } catch (error) {
      console.error('Error changing channel value:', error)
    } finally {
      setIsOpen(false)
    }
  }

  return (
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
              <LinkIcon />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Change to channel specific value</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Changing to channel specific value</DialogTitle>
          <DialogDescription>
            This will remove all values and translations for this attribute.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleContinue}
            className="gap-[var(--Gap-2,8px)] rounded-[var(--border-radius-md,6px)] bg-[var(--base-foreground,#18181B)] px-[var(--Gap-4,16px)] py-[var(--Gap-2-5,10px)] text-[#FAFAFA] hover:bg-[var(--base-foreground,#18181B)]/90"
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
