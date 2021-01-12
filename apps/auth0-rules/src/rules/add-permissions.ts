import type { RuleCallback, RuleContext, RuleUser } from '../types';

// Rule
function AddPermissions(user: RuleUser, context: RuleContext, cb: RuleCallback): void {
  context.idToken['https://lucifer-front/permissions'] = user.permissions;
  context.accessToken['https://lucifer-front/permissions'] = user.permissions;

  cb(null, user, context);
}
