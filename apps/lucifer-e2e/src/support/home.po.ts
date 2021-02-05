import { getMain } from './common.po';

export const getGreeting = () => getMain().findByRole('heading');
export const getRoles = () => getMain().findByLabelText('Roles');
