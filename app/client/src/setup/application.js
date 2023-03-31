export const globalPages = ($store) => {
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
    routeName: 'app.project.ticketboard',
    payload: {
      grid: false,
      slots: false,
      hasInspector: true,
      widgets: [{
        uuid: "ticketBoardWidget",
        name: 'ticketboard', // the name of the widget, must correspond to the actual folder name the widget files are located in
        face: 'default',
        props: { // and object which you can use to override the widgets default config in the context of this page
          title: 'Ticketboard',
          filter: {
            excluded: [],
            custom: [
              {
                identifier: ['tags:tag-todo'],
                excluded: [],
              },
              {
                identifier: ['tags:tag-doing'],
                excluded: [],
              },
              {
                identifier: ['tags:tag-test'],
                excluded: [],
              },
              {
                identifier: ['tags:tag-qa'],
                excluded: [],
              },
              {
                identifier: ['tags:tag-done'],
                excluded: [],
              }
            ]
          }
        }
      }],

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
export const globalTools = ($store) => {
  $store.dispatch({
    type: "navigationTools/add",
    payload: {
      pages: false,
      icon: "mdi-file-tree",
      uuid: "projectTree",
      widget: {
        name: "projectTree",
      },
    },
  });
  $store.dispatch({
    type: "navigationTools/add",
    payload: {
      pages: false,
      icon: "mdi-magnify",
      uuid: "projectSearch",
      widget: {
        name: "projectSearch",
      },
    },
  });
  $store.dispatch({
    type: "navigationTools/add",
    payload: {
      pages: false,
      icon: "mdi-history",
      uuid: "mostRecentlyUsed",
      widget: {
        name: "mostRecentlyUsed",
      },
    },
  });
  $store.dispatch({
    type: "navigationTools/add",
    payload: {
      pages: false,
      title: "quickList",
      icon: "mdi-list-status",
      uuid: "quickList",
      widget: {
        name: "quickList",
        face: 'expansionVertical'
      },
    },
  });
  $store.dispatch({
    type: "inspectorTools/add",
    payload: {
      title: "ticketsByTag",
      pages: false,
      icon: "mdi-chart-donut",
      uuid: "chart_ticketsByTag",
      widget: {
        name: "ticketboard",
        type: "chart",
        face: "ticketsByTag",
        props: {
          categories: [
            "tags:tag-todo",
            "tags:tag-doing",
            "tags:tag-test",
            "tags:tag-qa",
            "tags:tag-done",
          ],
        },
      },
    },
  });
  $store.dispatch({
    type: "inspectorTools/add",
    payload: {
      title: "chartJournal",
      pages: false,
      icon: "mdi-chart-pie",
      uuid: "journal_chart",
      widget: {
        name: "journal",
        type: "chart",
        face: "example",
      },
    },
  });
  /* $store.dispatch({
     type: "toolbar/add",
     payload: {
       page: false,
       title: "quickList",
       icon: "mdi-text-box-search-outline",
       iconActive: "mdi-text-box-search",
       uuid: "quickList",
       widget: {
         name: "quickList",
         face: 'expansionVertical'
       },
     },
   });
   $store.dispatch({
     type: "toolbar/add",
     payload: {
       title: "fileUploader",
       page: false,
       icon: "mdi-upload-network-outline",
       iconActive: "mdi-upload-network",
       uuid: "fileUploader_global",
       widget: {
         name: "fileUploader",
       },
     },
   });
   */
}
