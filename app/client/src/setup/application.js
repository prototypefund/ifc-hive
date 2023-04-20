/*
 * Global default configuration for 
 * - pages
 * - tags
 * - tools
 */
const globalPages = ($store) => {
  $store.dispatch({
    type: 'pages/add',
    routeName: 'public.login',
    payload: {
      grid: false,
      slots: false,
      widgets: [],
    }
  });
  $store.dispatch({
    type: 'pages/add',
    routeName: 'public.logout',
    payload: {
      grid: false,
      slots: false,
      widgets: [],
    }
  });
  $store.dispatch({
    type: 'pages/add',
    routeName: 'public.terms',
    payload: {
      grid: false,
      slots: false,
      widgets: [],
    }
  });

  $store.dispatch({
    type: 'pages/add',
    routeName: 'app.project.select',
    payload: {
      grid: false,
      slots: false,
      widgets: [],
    }
  });

  $store.dispatch({
    type: 'pages/add',
    routeName: 'app.index',
    payload: {
      grid: false,
      slots: false,
      widgets: [],
    }
  });
  $store.dispatch({
    type: 'pages/add',
    routeName: 'app.project.select',
    payload: {
      grid: false,
      slots: false,
      widgets: [],
    }
  });
  $store.dispatch({
    type: 'pages/add',
    routeName: 'app.project.index',
    payload: {
      grid: false,
      slots: false,
      widgets: [],
    }
  });
}

export {
  globalPages,
}
