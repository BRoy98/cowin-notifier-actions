const checker = require("./src/checker");
require("dotenv").config();

async function run() {
  await checker();
}

run();
