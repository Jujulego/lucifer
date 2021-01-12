import type { RuleCallback, RuleContext, RuleUser } from '../types';

// Rule
function AddPermissions(user: RuleUser, context: RuleContext, callback: RuleCallback): void {
  context.idToken['https://lucifer-front/roles'] = context.authorization.roles;
  context.accessToken['https://lucifer-front/roles'] = context.authorization.roles;

  return callback(null, user, context);
}
