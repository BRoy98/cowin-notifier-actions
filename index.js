const core = require("@actions/core");
const checker = require("./src/checker");
require("dotenv").config();

async function run() {
  try {
    await checker();
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
