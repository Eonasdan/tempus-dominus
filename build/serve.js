const { ParvusServer } = require('@eonasdan/parvus-server');

new ParvusServer({
  port: 3001,
  directory: `./docs`,
  middlewares: [],
})
  .startAsync()
  .then();
