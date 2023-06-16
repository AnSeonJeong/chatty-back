const config = require("./db_config").default;

module.exports = {
  development: config,
  test: config,
  production: config,
};
