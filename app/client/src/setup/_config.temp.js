export default {

  /*
   * expec for pages and tools all config keys go into the root level
   */
  ui: {
    theme: 'dark',
    colors: {},
    displayTitle: 'Projektjournal',
  },
  /*
   * Global Tools 
   */
  tools: [
    // quicklist (global tool)
    {
      page: false,
      title: "quickList",
      icon: "mdi-text-box-search-outline",
      iconActive: "mdi-text-box-search",
      uuid: "quickList",
      widget: {
        version: '1',
        name: "quickList",
        face: 'expansionVertical'
      }
    },

    // file uploader (global tool)
    {
      title: "fileUploader",
      page: false,
      icon: "mdi-upload-network-outline",
      iconActive: "mdi-upload-network",
      uuid: "fileUploader_global",
      widget: {
        version: '1',
        name: "fileUploader",
      }
    }
  ],

  /*
   * Pages
   */
  pages: {
    'app-dashboard': {
      scrollTop: false,
      grid: {
        type: 'default',
        items: 'card_flat',
        columns: 1
      },
      slots: [
        {
          'class': 'nice',
          column: 12,
          widget: {
            version: '1',
            name: 'debug',
            props: {
              title: 'anderer Titel'
            },
            uuid: 'fbdc7324-f8eb-4f9c-85f9-0a418063bf29'
          }
        }
      ],
      title: 'funoFun',
      uuid: 'app-dashboard',
      routeName: 'app.dashboard',
      locale: 'de',
      query: {},
      scrollY: 0
    },
    'app-ticketboard': {
      scrollTop: false,
      widgets: [{
        uuid: 'ticketBoardWidget',
        version: '1',
        name: 'ticketboard',
        face: 'default',
        props: {
          title: 'Ticketboard',
          filter: {
            excluded: [],
            custom: [
              {
                identifier: [
                  'tags:tag-todo'
                ],
                excluded: []
              },
              {
                identifier: [
                  'tags:tag-doing'
                ],
                excluded: []
              },
              {
                identifier: [
                  'tags:tag-test'
                ],
                excluded: []
              },
              {
                identifier: [
                  'tags:tag-qa'
                ],
                excluded: []
              },
              {
                identifier: [
                  'tags:tag-done'
                ],
                excluded: []
              }
            ]
          }
        }
      }],
      tools: [{
        title: 'ticketsByTag',
        page: 'app.ticketboard',
        icon: 'mdi-chart-donut',
        iconActive: 'mdi-chart-donut-variant',
        uuid: 'chart_ticketsByTag',
        widget: {
          version: '1',
          name: 'ticketboard',
          type: 'chart',
          face: 'ticketsByTag',
          props: {
            categories: [
              'tags:tag-todo',
              'tags:tag-doing',
              'tags:tag-test',
              'tags:tag-qa',
              'tags:tag-done'
            ]
          }
        }
      }],
      uuid: 'app-ticketboard',
      routeName: 'app.ticketboard',
      locale: 'de',
      query: {},
      scrollY: 0
    },
    'app-journal': {
      scrollTop: false,
      grid: {
        type: 'default',
        items: 'card_flat',
        columns: 1
      },
      slots: [
        {
          column: 12,
          widget: {
            uuid: 'journalWidget',
            version: '1',
            name: 'journal'
          }
        }
      ],
      tools: [{
        title: 'chartJournal',
        page: 'app.journal',
        icon: 'mdi-chart-donut',
        iconActive: 'mdi-chart-donut-variant',
        uuid: 'journal_chart',
        widget: {
          name: 'journal',
          version: '1',
          type: 'chart',
          face: 'example'
        }
      }],
      uuid: 'app-journal',
      routeName: 'app.journal',
      locale: 'de',
      query: {},
      scrollY: 0
    },
    'app-settings': {
      scrollTop: false,
      grid: {
        type: 'default',
        items: 'card',
        columns: 2
      },
      slots: [],
      title: 'the rolfness of life',
      uuid: 'app-settings',
      routeName: 'app.settings',
      locale: 'de',
      query: {},
      scrollY: 0
    },
    'app-accountSettings': {
      scrollTop: false,
      grid: {
        type: 'default',
        items: 'card_flat',
        columns: 1
      },
      slots: [
        {
          column: 12,
          widget: {
            name: 'boilerplate',
            version: '1',
            props: {
              title: 'Boilerplate default config',
              iLike: 'trains'
            },
            uuid: '330f9415-fa66-4f17-a757-bea04e65cbb5'
          }
        }
      ],
      title: 'funoFun',
      uuid: 'app-accountSettings',
      routeName: 'app.accountSettings',
      locale: 'de',
      query: {},
      scrollY: 0
    }
  },

}
