import { environment } from './environments/environment';

export const OAuthSettings = {
  appId: '9e2a6e76-ec14-4ca5-ab54-d1c55a12545c',
  redirectUri: `${environment.frontendProtocol}://${environment.frontendAddress}`,
  scopes: ['user.read'],
};
