import { getDialog, getMain } from './common.po';

// Table
export const getLoader = () => getMain().findByRole('progressbar');
export const getProjectsTable = () => getMain().findByRole('table');
export const getAddButton = () => getMain().findByLabelText('add project');

// Add dialog
export const getAddNameField = () => getDialog().findByLabelText('Nom *');
export const getAddSlugField = () => getDialog().findByLabelText('Slug *');
export const getAddDescriptionField = () => getDialog().findByLabelText('Description');
export const getAddSubmitButton = () => getDialog().findByText('Créer');
export const getAddLoader = () => getDialog().findByRole('progressbar');
