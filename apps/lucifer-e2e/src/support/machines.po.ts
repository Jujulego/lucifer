export const getMain = () => cy.findByRole('main');

export const getMachineTable = () => getMain().findByRole('table');
