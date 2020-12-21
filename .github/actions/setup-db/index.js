const core = require('@actions/core');
const fse = require('fs-extra');
const path = require('path');

(async () => {
  try {
    const workspace = fse.readJson('workspace.json');
    console.log(workspace);

    core.setFailed('!');
  } catch (error) {
    core.setFailed(error.message);
  }
})();
