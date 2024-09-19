import React from 'react';
import { OverlayTrigger, Tooltip as BootstrapTooltip } from 'react-bootstrap';

interface TooltipProps {
  message: string; // The message to display in the tooltip
  direction?: 'top' | 'bottom' | 'left' | 'right'; // Direction of the tooltip
  children: React.ReactNode; // The child component (e.g., an icon)
}

const Tooltip: React.FC<TooltipProps> = ({ message, direction = 'bottom', children }) => {
  return (
    <OverlayTrigger
      placement={direction}
      overlay={<BootstrapTooltip id={`tooltip-${direction}`}>{message}</BootstrapTooltip>}
    >
      <span>{children}</span>
    </OverlayTrigger>
  );
};

export default Tooltip;
