import React, { FC, MouseEvent, useEffect, useState } from 'react';
import copy from 'copy-to-clipboard';

import {
  IconButton, Tooltip,
  IconButtonProps
} from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';

// Types
export interface CopyButtonProps extends IconButtonProps {
  /** Content to be copied */
  text: string;

  /**
   * Mime type of content
   * @default text/plain
   */
  format?: string;

  /**
   * Tooltip content
   * @default Copié !
   */
  tooltip?: string;

  /**
   * Tooltip duration (in milliseconds)
   * @default 1500
   */
  tooltipTimeout?: number;

  /** Copied callback, called after a successful copy */
  onCopied?: () => void;
}

// Component
const CopyButton: FC<CopyButtonProps> = (props) => {
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
