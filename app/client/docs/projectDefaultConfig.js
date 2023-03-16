/*
 * The project config is an array with configs for
 *
 * Bellow everything is in an array. Alternative 
 *
 * {
 *   pages: {
 *    dashboard: { },
 *    ticketboard: {...},
 *    journal: { .. },
 *    settings: {...},
 *    accountSettings: {...} 
 *   },
 *
 *   tools: [{...}, {...}],
 *
 *   .//.. other project UI config stuff
 * }
 *
 * Widgets leben doch immer in einer Page, in der
 */


/* @NOTE currently still as one flat array */
const projectConfig = [

  /*
   * -------------------------------------------
   * Global Tools
   */

  /* quickList {global tool} */
  {
    uuid: "quickList",
    icon: "mdi-text-box-search-outline",
    iconActive: "mdi-text-box-search",
    page: false,
    title: "quickList",
    widgets: [{
      name: "quickList",
      face: 'expansionVertical'
    }],
  },

  /* fileUpload (global tool) */
  {
    uuid: "fileUploader_global",
    icon: "mdi-upload-network-outline",
    iconActive: "mdi-upload-network",
    page: false,
    title: "fileUploader",
    widgets: [{
      name: "fileUploader",
    }],
  },

  /*
   * -------------------------------------------
   * Pages
   */

  /* app.dashboard (page) */
  {
    title: "funoFun",
    grid: {
      type: "default",
      items: "card_flat",
      columns: 1
    },
    slots: [
      {
        class: "nice",
        column: 12,
        widget: {
          name: "debug",
          props: {
            title: "anderer Titel",
          }
        }
      }
    ],
    tools: null,
    widgets: null,
  },

  /* app.journal (page)  */
  {
    grid: {
      type: "default",
      items: "card_flat",
      columns: 1
    },
    slots: [
      {
        column: 12,
        widget: {
          uuid: "journalWidget",
          name: "journal"
        }
      }
    ],
    tools: [{
      _id: "journal_chart",
      title: "chartJournal",
      page: "app.journal",
      icon: "mdi-chart-donut",
      iconActive: "mdi-chart-donut-variant",
      widget: {
        name: "journal",
        type: "chart",
        face: "example",
      },
    }],
    widgets: null,
  },

  /* app.settings (page) */
  {
    grid: {
      type: "default",
      items: "card",
      columns: 2
    },
    title: "the rolfness of life",
    slots: null,
    tools: null,
    widgets: null,
  },

  /* ticketboard (page)  */
  {
    grid: null,
    slots: null,
    widgets: [{
      _id: "ticketBoardWidget",
      face: 'default',
      name: 'ticketboard',
      props: {
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
    tools: [{
      _id: "chart_ticketsByTag",
      icon: "mdi-chart-donut",
      iconActive: "mdi-chart-donut-variant",
      page: "app.ticketboard",
      title: "ticketsByTag",
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
    }]
  },

  /* app.accountSettings (page) */
  {
    title: 'funoFun',
    grid: {
      type: 'default',
      items: 'card_flat',
      columns: 1
    },
    slots: [
      {
        column: 12,
        widget: {
          name: "boilerplate",
          props: {
            title: 'Boilerplate default config',
            iLike: 'trains'
          }
        }
      },
    ],
    widgets: null,
    tools: null,
  },
]
