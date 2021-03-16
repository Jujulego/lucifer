// Rule
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function BlacklistE2EUsers(
  user: RuleUser,
  context: RuleContext,
  callback: RuleCallback
) {
  // Check is E2E user
  if (!user.app_metadata?.e2e) {
    return callback(null, user, context);
  }

  // Allowed only for e2e client
  if (context.clientID !== configuration.E2E_CLIENT) {
    return callback(new UnauthorizedError('Access denied.'), user, context);
  }

  callback(null, user, context);
}
