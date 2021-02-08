import { getMain } from './common.po';

// Table
export const getLoader = () => getMain().findByRole('progressbar');
export const getVariablesTable = () => getMain().findByRole('table');
export const getVariableRow = (text: string) => getVariablesTable().findByText(text).parents('tr');
