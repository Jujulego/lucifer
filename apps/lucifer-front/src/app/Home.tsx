import React from 'react';

import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { CopyButton, LabelledText } from '@lucifer/react/basics';

import { useAuth } from '../auth/auth.context';
import { useAuthToken, usePermissions } from '../auth/auth.hooks';

import PermissionChip from '../users/components/PermissionChip';

// Styles
const useStyles = makeStyles(({ spacing }) => ({
  root: {
    padding: spacing(2),
  },
  title: {
    marginBottom: spacing(4)
  },
  chip: {
    marginRight: spacing(1),

    '&:last-child': {
      marginRight: 0
    }
  }
}));

// Component
const Home = () => {
  // Auth
  const { user } = useAuth();
  const { permissions = [] } = usePermissions();
  const token = useAuthToken();

  // Render
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <Typography className={styles.title} variant="h5">Bonjour { user?.name } !</Typography>
      <LabelledText
        label="Token" zeroMinWidth
        endAdornment={<CopyButton text={token} />}
      >
        <Typography noWrap>{ token }</Typography>
      </LabelledText>
      <LabelledText label="Permissions">
        { permissions.map(perm => (
          <PermissionChip key={perm} className={styles.chip} permission={perm} />
        )) }
      </LabelledText>
    </div>
  );
};

export default Home;
