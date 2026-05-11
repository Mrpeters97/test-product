import { Badge } from './badge';
import { Tooltip, TooltipTrigger, TooltipContent } from '.';

const BADGE_TEXT = {
  'variant-channel-language': 'V-C-L',
  'variant-channel': 'V-C',
  'variant-language': 'V-L',
  'variant': 'V',
  'channel': 'C',
  'channel-local': 'C-L',
};

export default function AttributeBadge({ differsOn, diffLabels, ...rest }) {
  if (!differsOn) {
    return <div className="w-12 h-12 shrink-0" aria-hidden="true"></div>;
  }

  const badgeText = BADGE_TEXT[differsOn] || '';
  const tooltipText = diffLabels[differsOn] || '';

  return (
    <div className="w-12 h-6 shrink-0 flex items-center justify-center" data-tour="attribute-badge" {...rest}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className="whitespace-nowrap cursor-help"
            style={{
              color: 'var(--base-muted-foreground, #71717A)',
              fontFamily: 'var(--typography-font-family-font-sans, Inter)',
              fontSize: 'var(--typography-base-sizes-extra-small-font-size, 12px)',
              fontWeight: 'var(--font-weight-medium, 500)',
              lineHeight: 'var(--typography-base-sizes-extra-small-line-height, 16px)',
            }}
          >
            {badgeText}
          </Badge>
        </TooltipTrigger>
        <TooltipContent align="center">
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}