import { environment } from '../environments/environment';

// Auth config
const authConfig = {
  domain: 'dev-lucifer.eu.auth0.com',
  clientId: environment.auth0ClientId,
  audience: 'https://lucifer-api.herokuapp.com/'
}

export default authConfig;
