import React from 'react';

import { Chip, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { CopyButton, LabelledText } from '@lucifer/react/basics';

import { useAuth } from '../auth/auth.context';
import { useAuthToken } from '../auth/auth.hooks';
import { ROLES_KEY } from '../auth/auth-user';

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
      <LabelledText label="Roles">
        { user?.[ROLES_KEY]?.map(perm => (
          <Chip key={perm} className={styles.chip} label={perm} />
        )) }
      </LabelledText>
    </div>
  );
};

export default Home;
