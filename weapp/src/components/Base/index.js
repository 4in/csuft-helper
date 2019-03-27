const getCtx = selector => {
  const pages = getCurrentPages();
  const ctx = pages[pages.length - 1];

  const componentCtx = ctx.selectComponent(selector);

  if (!componentCtx) {
    console.error('无法找到对应的组件');
    return null;
  }
  return componentCtx;
};


const Loading = options => {
  const {selector = '#loading'} = options;
  const ctx = getCtx(selector);
  ctx.$component.handleShow(options);
};

Loading.hide = (selector = '#loading') => {
  const ctx = getCtx(selector);
  ctx.$component.handleHide();
};

export {
  Loading as $Loading
};

