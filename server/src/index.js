const Koa = require('koa');
const BodyParser = require('koa-bodyparser');
require('./utils/extends');
const routers = require('./routers');

const app = new Koa();
app.use(BodyParser());
app.use(routers.routes()).use(routers.allowedMethods());
app.listen(1007, () => {
  console.log(`The server is running at port 1007`);
});