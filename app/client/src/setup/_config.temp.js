/*
 * Default minimum config. Whenever a new project is created this should be
 * saved to the project configuration in the database.
 */
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
   * Global NavigationTools
   */
  navigationTools: {
    'projectTree': {
      pages: false,
      icon: "mdi-file-tree",
      uuid: "projectTree",
      widget: {
        name: "projectTree",
      },
    },
    'projectSearch': {
      pages: false,
      icon: "mdi-magnify",
      uuid: "projectSearch",
      widget: {
        name: "projectSearch",
      },
    },
    'mostRecentlyUsed': {
      pages: false,
      icon: "mdi-history",
      uuid: "mostRecentlyUsed",
      widget: {
        name: "mostRecentlyUsed",
      },
    },
    'quickList': {
      pages: false,
      icon: "mdi-list-status",
      uuid: "quickList",
      widget: {
        name: "quickList",
        face: 'expansionVertical'
      },
    }
  },
  /*
* inspectorTools
*/
  inspectorTools: {
    'journal_chart': {
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
  },
  /*
 * Pages
 */
  pages: {
    'app-project-dashboard': {
      icon: 'mdi-home',
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
      uuid: 'app-project-dashboard',
      hasInspector: true,
      routeName: 'app.project.dashboard',
      locale: 'de',
      query: {},
      scrollY: 0
    },
    'app-project-ticketboard': {
      scrollTop: false,
      icon: 'mdi-human-male-board-poll',
      widgets: [{
        uuid: 'ticketBoardWidget',
        version: '1',
        name: 'ticketboard',
        face: 'virtualScroll',
        props: {
          title: 'Ticketboard',
          filter: {
            excluded: [],
            custom: [
              {
                tagUUID: 'db22cd8a-11d5-4558-83fb-c5869075bc3a',
                query: {
                  tags: 'db22cd8a-11d5-4558-83fb-c5869075bc3a'
                }
              },
              {
                tagUUID: 'f7c8be57-90bc-48a9-b8fe-8ddf39370600',
                query: {
                  tags: 'f7c8be57-90bc-48a9-b8fe-8ddf39370600'
                }
              },
              {
                tagUUID: 'b5502367-35fa-4e4c-8ea5-ed6fe7236b6a',
                query: {
                  tags: 'b5502367-35fa-4e4c-8ea5-ed6fe7236b6a'
                }
              },
            ]
          }
        }
      }],
      uuid: 'app-project-ticketboard',
      routeName: 'app.project.ticketboard',
      locale: 'de',
      query: {},
      scrollY: 0
    },
    'app-project-journal': {
      icon: "mdi-file-document-multiple",
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
            name: 'journal',
            face: 'virtualScroll',
          }
        }
      ],
      uuid: 'app-project-journal',
      routeName: 'app.project.journal',
      locale: 'de',
      query: {},
      scrollY: 0
    },
    'app-project-settings': {
      icon: "mdi-cog",
      scrollTop: false,
      grid: {
        type: 'default',
        items: 'card',
        columns: 2
      },
      slots: [],
      title: 'the rolfness of life',
      uuid: 'app-project-settings',
      routeName: 'app.project.settings',
      locale: 'de',
      query: {},
      scrollY: 0
    },
    'app-project-account-settings': {
      icon: "mdi-account-cog",
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
      uuid: 'app-project-account-settings',
      routeName: 'app.project.account.settings',
      locale: 'de',
      query: {},
      scrollY: 0
    }
  },

}
