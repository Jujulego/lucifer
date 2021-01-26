export const getMain = () => cy.findByRole('main');

export const getGreeting = () => getMain().findByRole('heading');
export const getRoles = () => getMain().findByLabelText('Roles');
