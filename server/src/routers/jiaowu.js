const Router = require('koa-router');
const Cheerio = require('cheerio');
const request = require('../utils/request');
const router = new Router({
  prefix: '/jiaowu'
});

const getCookie = (header) => {
  if (!Array.isArray(header)) return [];
  let cookies = [];
  for (let c of header) {
    let cc = c.match(/(\S+)=([A-Za-z0-9_!-]+);?/i);
    if (cc.length !== 3) continue;
    cookies.push(`${cc[1]}=${cc[2]}`);
  }
  return cookies.join('; ');
};

router.post('/login', async (ctx, next) => {
  const {username, password, captcha} = ctx.request.body;
  if (!username || !password) throw new Error('账号或密码不能为空');
  let res = await request.get('http://authserver.csuft.edu.cn/authserver/login?service=http%3A%2F%2Fjwgl.csuft.edu.cn%2F');
  let cookies = getCookie(res.headers['set-cookie']);
  let jsessionid = res.data.getMiddleText('jsessionid=', '"');
  let $ = Cheerio.load(res.data);
  let params = [
    `username=${username}`,
    `password=${password}`,
    `lt=${$('input[name="lt"]').val()}`,
    `dllt=${$('input[name="dllt"]').val()}`,
    `execution=${$('input[name="execution"]').val()}`,
    `_eventId=${$('input[name="_eventId"]').val()}`,
    `rmShown=${$('input[name="rmShown"]').val()}`,
  ];
  res = await request.get(`http://authserver.csuft.edu.cn/authserver/needCaptcha.html?username=${username}`, {
    headers: {
      Cookie: cookies
    }
  });
  if (res.data !== false && (typeof captcha !== 'string' || captcha.length !== 4)) {
    res = await request.get('http://authserver.csuft.edu.cn/authserver/captcha.html', {
      responseType: 'arraybuffer',
      headers: {
        Cookie: cookies
      }
    });
    ctx.body = {
      code: 1,
      msg: '需要验证码',
      captcha: 'data:image/jpeg;base64,' + Buffer.from(res.data).toString('base64'),
      cookies,
      lt: $('input[name="lt"]').val(),
    };
    await next();
    return;
  }
  res = await request.post(`http://authserver.csuft.edu.cn/authserver/login;jsessionid=${jsessionid}?service=http://jwgl.csuft.edu.cn/`, params.join('&'), {
    maxRedirects: 0,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: cookies
    }
  });
  if (res.headers.location === undefined) throw new Error('账号或密码错误');
  res = await request.get(res.headers.location, {maxRedirects: 0});
  cookies = getCookie(res.headers['set-cookie']);
  res = await request.get(res.headers.location, {
    maxRedirects: 0,
    headers: {
      Cookie: cookies
    }
  });
  res = await request.get(res.headers.location, {
    headers: {
      Cookie: cookies
    }
  });
  $ = Cheerio.load(res.data);
  let name = $('.Nsb_top_menu_nc').text();
  ctx.body = {
    code: 0,
    cookies,
    name
  };
  await next();
});

router.get('/captcha', async (ctx, next) => {
  const {cookies} = ctx.query;
  let res = await request.get('http://authserver.csuft.edu.cn/authserver/captcha.html', {
    responseType: 'arraybuffer',
    headers: {
      Cookie: cookies
    }
  });
  ctx.body = {
    code: 0,
    captcha: 'data:image/jpeg;base64,' + Buffer.from(res.data).toString('base64'),
  };
  await next();
});

router.post('/login2', async (ctx, next) => {
  let {username, password, captcha, params: lt, cookies} = ctx.request.body;
  let params = [
    `username=${username}`,
    `password=${password}`,
    `lt=${lt}`,
    `dllt=userNamePasswordLogin`,
    `execution=e1s1`,
    `_eventId=submit`,
    `rmShown=1`,
    `captchaResponse=${captcha}`
  ];
  let res = await request.post(`http://authserver.csuft.edu.cn/authserver/login?service=http%3A%2F%2Fjwgl.csuft.edu.cn%2F`, params.join('&'), {
    maxRedirects: 0,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: cookies
    }
  });
  if (res.headers.location === undefined) throw new Error('账号或密码错误');
  res = await request.get(res.headers.location, {maxRedirects: 0});
  cookies = getCookie(res.headers['set-cookie']);
  res = await request.get(res.headers.location, {
    maxRedirects: 0,
    headers: {
      Cookie: cookies
    }
  });
  res = await request.get(res.headers.location, {
    headers: {
      Cookie: cookies
    }
  });
  $ = Cheerio.load(res.data);
  let name = $('.Nsb_top_menu_nc').text();
  ctx.body = {
    code: 0,
    cookies,
    name
  };
  await next();
});

router.get('/cet', async (ctx, next) => {
  let res = await request.get('http://jwgl.csuft.edu.cn/jsxsd/kscj/djkscj_list', {
    headers: {
      Cookie: ctx.get('cookies')
    }
  });
  const $ = Cheerio.load(res.data.replace(/[\t\r\n]/g, ''));
  const table = $('#dataList');
  let trs = table.find('tr');
  let scores = [];
  for (let i = 2; i < trs.length; ++i) {
    let tds = $(trs[i]).find('td');
    if (tds.length !== 9) continue;
    scores.push({
      id: $(tds[0]).text(),
      title: $(tds[1]).text(),
      scores_written: $(tds[2]).text(),
      scores_computer: $(tds[3]).text(),
      scores_total: $(tds[4]).text(),
      grades_written: $(tds[5]).text(),
      grades_computer: $(tds[6]).text(),
      grades_total: $(tds[7]).text(),
      date: $(tds[8]).text(),
    });
  }
  ctx.body = {
    code: 0,
    data: scores
  };
  await next();
});

router.get('/scores', async (ctx, next) => {
  const {term, attr = '', disp = 'all'} = ctx.query;
  if (term === undefined) throw new Error('参数不能为空');
  let params = [
    `kksj=${term}`,
    `kcxz=${attr}`,
    `kcmc=`,
    `xsfs=${disp}`,
  ];
  let res = await request.post('http://jwgl.csuft.edu.cn/jsxsd/kscj/cjcx_list', params.join('&'), {
    headers: {
      Cookie: ctx.get('cookies')
    }
  });
  const $ = Cheerio.load(res.data.replace(/[\t\r\n]/g, ''));
  const table = $('#dataList');
  const trs = table.find('tr');
  let scores = [];
  for (let i = 0; i < trs.length; ++i) {
    let tds = $(trs[i]).find('td');
    if (tds.length !== 13) continue;
    // 序号 开课学期 课程编号 课程名称 成绩 学分 总学时 绩点 成绩标志 考核方式 考试性质 课程属性 课程性质
    scores.push({
      order: $(tds[0]).text().trim(),
      term: $(tds[1]).text().trim(),
      id: $(tds[2]).text().trim(),
      title: $(tds[3]).text().trim(),
      score: $(tds[4]).text().trim(),
      credit: $(tds[5]).text().trim(),
      period: $(tds[6]).text().trim(),
      gpa: $(tds[7]).text().trim(),
      flag: $(tds[8]).text().trim(),
      method: $(tds[9]).text().trim(),
      property_exam: $(tds[10]).text().trim(),
      attr: $(tds[11]).text().trim(),
      property_course: $(tds[12]).text().trim(),
    });
  }
  ctx.body = {
    code: 0,
    data: scores
  };
  await next();
});

router.get('/timetable', async (ctx, next) => {
  let res = await request.get('http://jwgl.csuft.edu.cn/jsxsd/xskb/xskb_list.do', {
    headers: {
      Cookie: ctx.get('cookies')
    }
  });
  const $ = Cheerio.load(res.data.replace(/[\t\r\n]/g, ''));
  const table = $('#kbtable');
  const trs = table.find('tr');
  if (trs.length < 3) throw new Error('获取课表失败');
  let sections = [];  // 节次
  for (let i = 1; i < trs.length - 1; ++i) {
    const tds = $(trs[i]).find('td');
    if (tds.length !== 7) continue;
    let courses = [];  // 课程
    for (let u = 0; u < tds.length; ++u) {
      let content = $(tds[u]).find('.kbcontent');
      content.find('br').remove();
      let elems = content.contents();
      if (elems.length === 1) {
        courses.push([]);
        continue;
      }
      let text = [];
      let c = [];
      for (let j = 0; j < elems.length; ++j) {
        let insert = false;
        if ($(elems[j]).text() === '---------------------') {
          insert = true;
        } else {
          c.push($(elems[j]).text());
          if (j === elems.length - 1) insert = true;
        }
        if (insert) {
          let obj = {
            title: c[0] || '',
            teacher: c[1] || '',
            weeks: c[2] || '',
            classroom: c[3] || '',
          };
          if (c[2] !== undefined) {
            let p = c[2].replace('(周)', '').split(',');
            let w = []; // 周次
            try {
              for (let raw of p) {
                if (raw.indexOf('-') > -1) {
                  let tmp = raw.split('-');
                  if (tmp.length !== 2) continue;
                  for (let i = tmp[0]; i <= tmp[1]; ++i) {
                    w.push(i);
                  }
                } else if (raw.indexOf('、') > -1) {
                  let tmp = raw.split('、');
                  for (let t of tmp) {
                    if (t > 0) w.push(t);
                  }
                } else if (raw > 0) {
                  w.push(raw);
                }
              }
            } catch (e) {
            }
            let unique = [];
            for (let i in w) {
              let r = Number(w[i]);
              if (unique.indexOf(r) === -1) unique.push(r);
            }
            unique.sort((a, b) => a - b);
            obj.w = unique;
          }
          text.push(obj);
          c = [];
        }
      }
      courses.push(text);
    }
    sections.push({
      title: $(trs[i]).find('th').text().trim(),
      courses
    });
  }
  let note = $(trs[trs.length - 1]).text();
  ctx.body = {
    code: 0,
    data: {sections, note},
    term_start: 1551024000
  };
  await next();
});

module.exports = router;