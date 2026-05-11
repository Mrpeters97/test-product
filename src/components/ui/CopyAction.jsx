import { useState } from 'react';
import { Button } from './button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '.';
import { CopyIconWhite } from './Icons';

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="12" viewBox="0 0 15 12" fill="none">
    <path d="M3.95833 5.58566L0.625 7.25232L7.05315 10.4664C7.14061 10.5101 7.18433 10.532 7.2302 10.5406C7.27082 10.5482 7.31251 10.5482 7.35313 10.5406C7.399 10.532 7.44273 10.5101 7.53018 10.4664L13.9583 7.25232L10.625 5.58566M0.625 3.91899L7.05315 0.704912C7.14061 0.661185 7.18433 0.639321 7.2302 0.630716C7.27082 0.623095 7.31251 0.623095 7.35313 0.630716C7.399 0.639321 7.44273 0.661185 7.53018 0.704912L13.9583 3.91899L7.53018 7.13307C7.44273 7.17679 7.399 7.19866 7.35313 7.20726C7.31251 7.21488 7.27082 7.21488 7.2302 7.20726C7.18433 7.19866 7.14061 7.17679 7.05315 7.13307L0.625 3.91899Z" stroke="black" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function CopyAction({ field, onCopyConfirm, disabled, icon }) {
  const [isOpen, setIsOpen] = useState(false);
  const copyOption = 'variants'; // Only option: All variants

  const handleConfirm = () => {
    onCopyConfirm(field, copyOption);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
          {icon || <CopyIcon />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Copy values to</DialogTitle>
          <DialogDescription>
            Directly copy this value to other variants. Existing values will be overwritten and this action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 my-4">
          <div className="flex items-start gap-3 p-3 border rounded-lg bg-gray-50">
            <div className="mt-1">
              <input
                type="radio"
                name={`copy-option-${field}`}
                value="variants"
                checked={true}
                readOnly
                className="cursor-pointer"
              />
            </div>
            <div>
              <div className="font-medium text-sm">All variants</div>
              <div className="text-xs text-gray-600">Copies this value to all variants</div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
          <Button onClick={handleConfirm} className="gap-[var(--Gap-2,8px)] rounded-[var(--border-radius-md,6px)] bg-[var(--base-foreground,#18181B)] px-[var(--Gap-4,16px)] py-[var(--Gap-2-5,10px)] text-[#FAFAFA] hover:bg-[var(--base-foreground,#18181B)]/90">
            Copy to
            <CopyIconWhite />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}