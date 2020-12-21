const core = require('@actions/core');
const path = require('path');

(async () => {
  try {
    console.log(process.cwd());
    core.setFailed('!');
  } catch (error) {
    core.setFailed(error.message);
  }
})();
