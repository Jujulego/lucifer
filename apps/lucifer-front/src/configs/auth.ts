import { env } from '../environments/environment';

// Auth config
const authConfig = {
  domain: 'jujulego.eu.auth0.com',
  clientId: env.auth0ClientId,
  audience: 'https://lucifer-api.herokuapp.com/'
}

export default authConfig;
