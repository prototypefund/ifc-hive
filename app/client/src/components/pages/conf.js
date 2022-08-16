export default {
  project_index: {
    grid: {
      type: 'default',
      items: 'card',
      columns: 3
    },
    slots: [{
      class: 'v-col-12',
      widget:
      {
        name: 'projects',
        props: {
          title: "stuhlnase",
          type: 'currentPage'
        }
      }
    }],
  },
  journal: {
    grid: {
      type: 'default',
      items: 'card_flat',
      columns: 3
    },
    slots: [{
      class: 'v-col-12',
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
        class: 'v-col-6',
        widget: {
          name: 'detail',
          face: 'user',
          props: {
            title: 'Detail Ansicht',
          }
        }
      }, {
        class: 'v-col-3',
        widget: {
          uuid: 'currPageDebug',
          name: 'debug',
          props: {
            title: "döner",
            type: 'currentPage'
          }

        }
      },
      {
        class: 'v-col-3',
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
      items: 'card_flat',
      columns: 2
    },
    title: 'funoFun',
    slots: [
      {
        class: 'v-col-12',
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
        class: 'v-col-4',
        widget: {
          name: 'debug',
          uuid: 'currPageDebug',
          props: {
            title: "döner",
            type: 'pages'
          }

        }
      }, {
        class: 'v-col-4',
        widget:
        {
          name: 'debug',
          props: {
            title: "ralf",
            type: 'currentPage'
          }
        }
      }, {
        class: 'v-col-4',
        widget:
        {
          name: 'debug',
          props: {
            title: "sein Mudda",
            type: 'widgets'
          }
        }
      },
    ]
  }
}
