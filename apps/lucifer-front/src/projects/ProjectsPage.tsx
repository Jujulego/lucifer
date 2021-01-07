import React, { FC, useRef } from 'react';

import { Paper } from '@material-ui/core';

import { ProjectsTable } from './ProjectsTable';

// Component
export const ProjectsPage: FC = () => (
  <ProjectsTable adminId='me' />
);
