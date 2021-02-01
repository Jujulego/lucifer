export const getMain = () => cy.findByRole('main');

export const getLoader = () => getMain().findByRole('progressbar');
export const getMachineTable = () => getMain().findByRole('table');
