import { getMain } from './common.po';

export const getLoader = () => getMain().findByRole('progressbar');
export const getProjectsTable = () => getMain().findByRole('table');
