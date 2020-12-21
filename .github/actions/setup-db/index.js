const core = require('@actions/core');
const fse = require('fs-extra');
const path = require('path');

(async () => {
  try {
    // Load inputs
    const config = {
      host:     core.getInput('db-host'),
      port:     core.getInput('db-port'),
      username: core.getInput('db-username'),
      passport: core.getInput('db-passport'),
    };

    // Load workspace
    const workspace = await fse.readJson('workspace.json');

    // Search for ormconfig files
    await Promise.all(Object.values(workspace.projects).map(async ({ root }) => {
      const ormPath = path.join(root, 'ormconfig.json');

      if (await fse.exists(ormPath)) {
        // Change values
        const orm = await fse.readJson(ormPath);
        orm.host     = config.host;
        orm.port     = config.port;
        orm.username = config.username;
        orm.passport = config.passport;

        await fse.writeJson(ormPath, orm, { spaces: 2 });

        console.log(`updated ${ormPath} with`, orm)
      }
    }));
  } catch (error) {
    core.setFailed(error.message);
  }
})();
