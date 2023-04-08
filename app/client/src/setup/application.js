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


const globalTags = ($store) => {
  $store.dispatch({
    type: "data/push",
    payload: {
      data: [{
        _id: "tag-todo",
        _type: "tag",
        _disId: '12',
        _project: false,
        _title: 'TODO',
        _source: {
          _id: "tag-todo",
          title: "Todo",
          type: "status",
          color: "red",
          tags: [],
          locked: 0,
        },
      }, {
        _id: "tag-qa",
        _type: "tag",
        _disId: '12',
        _project: false,
        _title: 'QA',
        _source: {
          _id: "tag-qa",
          title: "QA",
          type: "status",
          color: "orange",
          tags: [],
          locked: 0,
        },
      },
      {
        _id: "tag-doing",
        _type: "tag",
        _disId: '98e',
        _project: false,
        _title: 'Doing',
        _source: {
          _id: "tag-doing",
          title: "Doing",
          type: "status",
          color: "green",
          tags: [],
          locked: 0,
        },
      },
      {
        _id: "tag-test",
        _type: "tag",
        _disId: '98d4f9e',
        _project: false,
        _title: 'Test',
        _source: {
          _id: "tag-test",
          title: "Test",
          type: "status",
          color: "yellow",
          tags: [],
          locked: 0,
        },
      },
      {
        _id: "tag-done",
        _type: "tag",
        _disId: '984f9e',
        _project: false,
        _title: 'done',
        _source: {
          _id: "tag-done",
          title: "Done",
          type: "status",
          color: "orange",
          tags: [],
          locked: 0,
        },
      }

      ]
    }
  }
  )
}
const globalTools = ($store) => {
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

export {
  globalPages,
  globalTools,
  globalTags,
}
