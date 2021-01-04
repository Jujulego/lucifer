import React, { FC, useCallback, useRef, useState } from 'react';

import {
  Fab, IconButton,
  DialogTitle, DialogContent,
  List, ListItem, ListItemText,
  TableContainer, TableHead, TableCell,
  Fade, Zoom,
  Portal,
  makeStyles
} from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';

import { ConfirmDialog, RefreshButton, ToolbarAction, useConfirm } from '@lucifer/react/basics';
import { Table, TableBody, TableRow, TableSortCell } from '@lucifer/react/table';
import { IProject } from '@lucifer/types';

import { useNeedScope } from '../auth/auth.hooks';

import { useProjects } from './projects.hooks';

// Types
export interface ProjectTableProps {
  show: boolean;
  adminId: string;
  actionsContainer: HTMLElement | null;
}

// Styles
const useStyles = makeStyles(({ spacing }) => ({
  actions: {
    padding: 0,
    textAlign: 'right'
  },
  confirmContent: {
    padding: 0,
  },
  fab: {
    position: 'absolute',
    bottom: spacing(2),
    right: spacing(2)
  }
}));

// Component
export const ProjectTable: FC<ProjectTableProps> = (props) => {
  // Props
  const { adminId, show, actionsContainer } = props;

  // API
  const { projects = [], loading, reload } = useProjects(adminId);

  // Render
  const styles = useStyles();

  return (
    <>
      <Portal container={actionsContainer}>
        <span>
          <Fade in={show}>
            <RefreshButton refreshing={loading} onClick={reload} />
          </Fade>
        </span>
      </Portal>
      { show && (
        <TableContainer>
          <Table documents={projects}>
            <TableHead>
              <TableRow>
                <TableSortCell<IProject> field="name">Nom</TableSortCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              { (prj: IProject) => (
                <TableRow key={prj.id} doc={prj}>
                  <TableCell>
                    { prj.name }
                  </TableCell>
                  <TableCell className={styles.actions} onClick={event => event.stopPropagation()}>

                  </TableCell>
                </TableRow>
              ) }
            </TableBody>
          </Table>
        </TableContainer>
      ) }
    </>
  );
}
