import { getDialog, getMain } from './common.po';

// Table
export const getVariablesTable = () => getMain().findByRole('table');
export const getVariableRow = (text: string) => getVariablesTable().findByText(text).parents('tr');
export const getAddButton = () => getMain().findByLabelText('add variable');
export const getDeleteButton = () => getMain().findByLabelText('delete variables');

// Add dialog
export const getDialogNameField = () => getDialog().findByLabelText('Nom *');
export const getDialogSlugField = () => getDialog().findByLabelText('Slug *');
export const getDialogValueField = () => getDialog().findByLabelText('Valeur *');
export const getDialogSubmitButton = () => getDialog().findByText('créer', { exact: false });
export const getDialogLoader = () => getDialog().findByRole('progressbar');
