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
import { Add as AddIcon, Delete as DeleteIcon } from '@material-ui/icons';

import { ConfirmDialog, RefreshButton, ToolbarAction, useConfirm } from '@lucifer/react/basics';
import { Table, TableBody, TableRow, TableSortCell } from '@lucifer/react/table';
import { IProject } from '@lucifer/types';

import { useNeedScope } from '../auth/auth.hooks';

import { useProjects } from './projects.hooks';
import { AddProjectDialog } from './AddProjectDialog';

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

  // State
  const [creating, setCreating] = useState(false);
  const { state: deleteState, confirm: confirmDelete } = useConfirm<IProject[]>([]);

  // Ref
  const selection = useRef<IProject[]>([]);

  // Auth
  const canCreate = useNeedScope('create:projects', usr => [adminId, 'me'].includes(usr?.id || '')) ?? false;
  const canDelete = useNeedScope('delete:projects', usr => [adminId, 'me'].includes(usr?.id || '')) ?? false;

  // API
  const { projects = [], loading, reload, create, bulkDelete } = useProjects(adminId);

  // Callbacks
  const handleDelete = useCallback(async (projects: IProject[]) => {
    const ids = projects.map(mch => mch.id);

    if (await confirmDelete(projects)) {
      await bulkDelete(ids);
    }
  }, [bulkDelete, confirmDelete]);

  // Render
  const styles = useStyles();

  return (
    <>
      <Portal container={actionsContainer}>
        <span>
          { canDelete && (
            <Fade in={show}>
              <ToolbarAction
                tooltip="Supprimer des projets" disabled={!canDelete}
                onClick={() => handleDelete(selection.current)}
              >
                <DeleteIcon />
              </ToolbarAction>
            </Fade>
          ) }
          <Fade in={show}>
            <RefreshButton refreshing={loading} onClick={reload} />
          </Fade>
        </span>
      </Portal>
      { show && (
        <TableContainer>
          <Table documents={projects} selectionRef={selection}>
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
                    { canDelete && (
                      <IconButton onClick={() => handleDelete([prj])}>
                        <DeleteIcon />
                      </IconButton>
                    ) }
                  </TableCell>
                </TableRow>
              ) }
            </TableBody>
          </Table>
          <AddProjectDialog
            open={canCreate && creating}
            onAdd={create}
            onClose={() => setCreating(false)}
          />
          <ConfirmDialog state={deleteState}>
            { (projects) => (
              <>
                <DialogTitle>Supprimer { projects.length } projets ?</DialogTitle>
                <DialogContent className={styles.confirmContent} dividers>
                  <List>
                    { projects.map((prj) => (
                      <ListItem key={prj.id}>
                        <ListItemText primary={prj.name} secondary={prj.id} />
                      </ListItem>
                    )) }
                  </List>
                </DialogContent>
              </>
            ) }
          </ConfirmDialog>
        </TableContainer>
      ) }
      { canCreate && (
        <Zoom in={show}>
          <Fab
            className={styles.fab} color="primary"
            onClick={() => setCreating(true)}
          >
            <AddIcon />
          </Fab>
        </Zoom>
      ) }
    </>
  );
}
