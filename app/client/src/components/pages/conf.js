export default {
  project_index: {
    grid: {
      type: 'default',
      items: 'card',
      columns: 3
    },
    slots: [{
      column: 'v-col-12',
      widget:
      {
        name: 'projects',
        props: {
          type: 'currentPage'
        }
      }
    }],
  },
  journal: {
    grid: {
      type: 'default',
      items: 'card',
      columns: 3
    },
    slots: [{
      column: 'v-col-12',
      widget:
      {
        uuid: 'journal',
        name: 'journal',
      }
    }],
    title: 'Daniel One Title'
  },

  testboard: {
    grid: {
      type: 'default',
      items: 'card',
      columns: 2
    },
    title: 'testSpaß für Groß und klein',
    slots: [
      {
        column: 'v-col-3',
        widget: {
          name: 'detail',
          face: 'user',
          props: {
            title: 'Detail Ansicht',
          }
        }
      }, {
        column: 'v-col-3',
        widget: {
          uuid: 'currPageDebug',
          name: 'debug',
          props: {
            type: 'currentPage'
          }

        }
      },
      {
        column: 'v-col-3',
        widget: {
          name: 'timeline',
          props: {
            title: 'anderer Titel',
            query: {
              q: 'ich bin voll die andere query',
              filter: 'und ich bin ein anderer Filter!'
            }
          }
        }
      },
    ],
    count: 0,
  },
  dashboard: {
    grid: {
      type: 'default',
      items: 'card',
      columns: 2
    },
    title: 'funoFun',
    slots: [
      {
        column: 'v-col-3',
        widget: {
          name: 'timeline',
          props: {
            title: 'anderer Titel',
            query: {
              q: 'ich bin voll die andere query',
              filter: 'und ich bin ein anderer Filter!'
            }
          }
        }
      },
    ],
  },
  settings: {
    grid: {
      type: 'default',
      items: 'card',
      columns: 3
    },
    title: 'the rolfness of life',
    slots: [
      {
        column: 'v-col-6',
        widget: {
          uuid: 'currPageDebug',
          name: 'debug',
          props: {
            type: 'pages'
          }

        }
      }, {
        column: 'v-col-6',
        widget:
        {
          uuid: 'currPageDebug',
          name: 'debug',
          props: {
            type: 'currentPage'
          }
        }
      }, {
        column: 'v-col-12',
        widget:
        {
          uuid: 'currPageDebug',
          name: 'debug',
          props: {
            type: 'widgets'
          }
        }
      },
    ]
  }
}
