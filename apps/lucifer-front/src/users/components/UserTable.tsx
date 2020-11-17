import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';

import { Link, Paper, TableCell, TableContainer, TableHead, Tooltip } from '@material-ui/core';
import { Check as CheckIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import {
  RefreshButton,
  RelativeDate,
  Table,
  TableBody,
  TableRow,
  TableSortCell,
  TableToolbar
} from '../../basics/components';

import { IUser } from '@lucifer/types';
import { useUsers } from '../users.hooks';

// Styles
const useStyles = makeStyles(({ spacing }) => ({
  verified: {
    marginTop: -spacing(.5),
    marginBottom: -spacing(.5),
    marginLeft: spacing(1),
  }
}));

// Component
const UserTable = () => {
  // Router
  const { url } = useRouteMatch();

  // API
  const { users = [], loading, reload } = useUsers();

  // Render
  const styles = useStyles();

  const toolbar = (
    <Paper square>
      <TableToolbar title="Utilisateurs">
        <RefreshButton refreshing={loading} onClick={reload} />
      </TableToolbar>
    </Paper>
  );

  return (
    <TableContainer>
      <Table documents={users} toolbar={toolbar}>
        <TableHead>
          <TableRow>
            <TableSortCell<IUser> field="name">Nom</TableSortCell>
            <TableSortCell<IUser> field="email">Email</TableSortCell>
            <TableSortCell<IUser> field="lastLogin">Dernière connexion</TableSortCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { (usr: IUser) => (
            <TableRow key={usr.id} doc={usr}>
              <TableCell>
                <Link component={RouterLink} to={`${url}/${usr.id}`}>
                  { usr.name }
                </Link>
              </TableCell>
              <TableCell>
                { usr.email }
                { usr.emailVerified && (
                  <Tooltip title='Vérifié'>
                    <CheckIcon classes={{ root: styles.verified }} color='primary' />
                  </Tooltip>
                ) }
              </TableCell>
              <TableCell>
                <RelativeDate date={usr.lastLogin} mode='from' />
              </TableCell>
            </TableRow>
          ) }
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserTable;
