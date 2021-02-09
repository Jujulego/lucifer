import { getDialog, getMain } from './common.po';

// Table
export const getProjectsTable = () => getMain().findByRole('table');
export const getProjectRow = (text: string) => getProjectsTable().findByText(text).parents('tr');
export const getAddButton = () => getMain().findByLabelText('add project');
export const getDeleteButton = () => getMain().findByLabelText('delete projects');

// Add dialog
export const getAddNameField = () => getDialog().findByLabelText('Nom *');
export const getAddSlugField = () => getDialog().findByLabelText('Slug *');
export const getAddDescriptionField = () => getDialog().findByLabelText('Description');
export const getAddSubmitButton = () => getDialog().findByText('créer', { exact: false });
export const getAddLoader = () => getDialog().findByRole('progressbar');
export const getAddCloseButton = () => getDialog().findByLabelText('close dialog');
