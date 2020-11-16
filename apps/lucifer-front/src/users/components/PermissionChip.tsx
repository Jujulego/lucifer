import React, { ReactElement } from 'react';

import { Chip, ChipProps } from '@material-ui/core';
import { People as PeopleIcon } from '@material-ui/icons';

// Types
export type PermissionChipProps = Omit<ChipProps, 'label' | 'icon'> & {
  permission: string;
}

// Constants
const NAMESPACE_ICONS: Record<string, ReactElement> = {
  'users': <PeopleIcon />
};

// Components
const PermissionChip = (props: PermissionChipProps) => {
  const { permission, ...chip } = props;

  // Render
  const [, namespace] = permission.split(':');
  const icon = NAMESPACE_ICONS[namespace];

  return (
    <Chip {...chip}
      icon={icon}
      label={permission}
    />
  );
};

export default PermissionChip;
