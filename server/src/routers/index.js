const fs = require('fs');
const path = require('path');
const Router = require('koa-router');
const router = new Router();

router.all('*', async (ctx, next) => {
  ctx.set('Content-Type', 'application/json');
  ctx.set('Access-Control-Allow-Origin', ctx.request.headers.origin);
  ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
  ctx.set('Access-Control-Allow-Credentials', 'true');
  try {
    await next();
  } catch (e) {
    const err = new Error(e);
    ctx.body = {
      code: -1,
      msg: err.message,
    };
  }
});

router.get('/', async (ctx, next) => {
  ctx.body = 'Hello, CSUFT!';
  await next();
});

router.get('/modules', async (ctx, next) => {
  ctx.body = {
    code: 0,
    data: [
      {
        image: '/assets/shark.svg',
        title: '成绩查询',
        page: '/pages/modules/scores/index',
      },
      {
        image: '/assets/star.svg',
        title: '等级考试成绩',
        page: '/pages/modules/cet/index',
      },
      {
        image: '/assets/tower.svg',
        title: '学期课表',
        page: '/pages/modules/timetable/index',
      },
    ]
  };
  await next();
});

const files = fs.readdirSync(__dirname);
for (let file of files) {
  if (file === path.basename(__filename)) continue;
  const mod = require(path.resolve(__dirname, file));
  router.use(mod.routes()).use(mod.allowedMethods());
}

module.exports = router;