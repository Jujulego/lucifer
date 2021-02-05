import { getDialog } from './common.po';

export const getConfirmList = () => getDialog().findByRole('list');
export const getConfirmCancelButton = () => getDialog().findByText('Annuler');
export const getConfirmConfirmButton = () => getDialog().findByText('Confirmer');
