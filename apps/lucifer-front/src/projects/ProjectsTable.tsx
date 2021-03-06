import React, { FC, useCallback, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import {
  Fab, Link,
  DialogTitle, DialogContent,
  List, ListItem, ListItemText,
  TableContainer, TableHead, TableCell,
  Fade, Zoom,
  Paper,
  makeStyles, Typography
} from '@material-ui/core';
import { Add as AddIcon, Delete as DeleteIcon } from '@material-ui/icons';

import { ConfirmDialog, RefreshButton, useConfirm } from '@lucifer/react-basics';
import { Table, TableAction, TableBody, TableRow, TableSortCell, TableToolbar } from '@lucifer/react-table';
import { IProject } from '@lucifer/types';

import { useNeedRole } from '../auth/auth.hooks';
import { usePageTab } from '../layout/page-tab.context';
import { PageActions } from '../layout/PageActions';

import { useProjects } from './projects.hooks';
import { AddProjectDialog } from './AddProjectDialog';

// Types
export interface ProjectsTableProps {
  adminId: string;
  inUserPage?: boolean;
}

// Styles
const useStyles = makeStyles(({ spacing }) => ({
  description: {
    maxWidth: 0,
  },
  actions: {
    width: 0,
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
export const ProjectsTable: FC<ProjectsTableProps> = (props) => {
  // Props
  const {
    adminId,
    inUserPage = false
  } = props;

  // Context
  const { open } = usePageTab();

  // State
  const [creating, setCreating] = useState(false);
  const { state: deleteState, confirm: confirmDelete } = useConfirm<IProject[]>([]);

  // Auth
  const isAdmin = useNeedRole('admin', usr => usr?.id === adminId) ?? false;

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

  const toolbar = inUserPage ? (
    <PageActions>
      { open && (
        <TableAction
          tooltip="Supprimer des projets" when="some" disabled={!isAdmin}
          aria-label="delete projects"
          onActivate={(selection: IProject[]) => handleDelete(selection)}
        >
          <DeleteIcon />
        </TableAction>
        ) }
      <Fade in={open}>
        <RefreshButton refreshing={loading} onClick={reload} />
      </Fade>
    </PageActions>
  ) : (
    <Paper square>
      <TableToolbar title="Projets">
        { (open && isAdmin) && (
          <TableAction
            tooltip="Supprimer des projets" when="some"
            onActivate={handleDelete}
          >
            <DeleteIcon />
          </TableAction>
        ) }
        <Fade in={open}>
          <RefreshButton refreshing={loading} onClick={reload} />
        </Fade>
      </TableToolbar>
    </Paper>
  );

  return (
    <>
      { open && (
        <TableContainer>
          <Table documents={projects} toolbar={toolbar}>
            <TableHead>
              <TableRow>
                <TableSortCell<IProject> field="name">Nom</TableSortCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { (prj: IProject) => (
                <TableRow key={prj.id} doc={prj}>
                  <TableCell>
                    <Link component={RouterLink} to={`/projects/${adminId}/${prj.id}`}>
                      { prj.name }
                    </Link>
                  </TableCell>
                  <TableCell className={styles.description}>
                    <Typography noWrap>{ prj.description }</Typography>
                  </TableCell>
                </TableRow>
              ) }
            </TableBody>
          </Table>
          <AddProjectDialog
            open={isAdmin && creating}
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
      { isAdmin && (
        <Zoom in={open}>
          <Fab
            className={styles.fab} color="primary"
            aria-label="add project"
            onClick={() => setCreating(true)}
          >
            <AddIcon />
          </Fab>
        </Zoom>
      ) }
    </>
  );
}
