import React, { FC, MouseEvent, useEffect, useState } from 'react';
import copy from 'copy-to-clipboard';

import {
  IconButton, Tooltip,
  IconButtonProps
} from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';

// Types
export interface CopyButtonProps extends IconButtonProps {
  text: string;
  format?: string;

  tooltip?: string;
  tooltipTimeout?: number;

  onCopied?: () => void;
}

// Component
const CopyButton: FC<CopyButtonProps> = (props: CopyButtonProps) => {
  // Props
  const {
    text, format = "text/plain",
    tooltip = "Copié !",
    tooltipTimeout = 1500,
    onCopied, onClick,
    ...btn
  } = props;

  // State
  const [showTooltip, setShowTooltip] = useState(false);

  // Handler
  const handleCopy = (event: MouseEvent<HTMLButtonElement>) => {
    if (onClick) onClick(event);

    // Copy
    const success = copy(text, { format });

    if (success) {
      setShowTooltip(true);
      if (onCopied) onCopied();
    }
  };

  // Effect
  useEffect(() => {
    if (showTooltip) {
      const id = setTimeout(() => setShowTooltip(false), tooltipTimeout);
      return () => clearTimeout(id);
    }
  }, [showTooltip, tooltipTimeout]);

  // Render
  return (
    <Tooltip
      title={tooltip} open={showTooltip}
      onOpen={() => setShowTooltip(true)}
      onClose={() => setShowTooltip(false)}
      disableFocusListener disableHoverListener disableTouchListener
    >
      <IconButton {...btn} onClick={handleCopy}>
        <FileCopyIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

export default CopyButton;
