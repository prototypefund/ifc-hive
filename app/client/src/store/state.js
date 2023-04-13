/*
 * Default state of the store
 *
 * exports
 *
 * - loadingHold
 * - applicationState (initial state of the store)
 * - configPatterns
 * - storePatterns
 */


/*
 * Used as a timer value
 */
const loadingHold = 200

/*
 * applicationState
 * Our actual application data
 */
const applicationState = {
  data: {},
  uploader: {},
  queries: {},
  socket: {
    status: null,
    message: null,
  },
  user: {
    _id: false,
    nickname: false,
    email: false,
    firstname: false,
    lastname: false,
  },
  organization: {
    id: false,
  },
  project: {
    id: null,
    list: []
  },
  ui: {
    // indicates the left navigation bar state
    navigationOpen: false,
    // indicates the currently selected Tool for the toolbar
    currentTool: false, // TODO REMOVE
    currentNavigationTool: false,
    currentInspectorTool: false,
    // indicates if the widget toolbar and other ui edit stuff is displayed
    editMode: false,
    // some dimension values for convenience
    viewPortHeight: false,
    viewPortWidth: false,
    windowWidth: false,
    // indicates if the page is in loading state
    loading: true,
    mobile: false,
    theme: 'dark'
  },
  // will contain tools. Logic behind that is the same as with pages
  toolbar: {},// TODO REMOVE
  navigationTools: {},
  inspectorTools: {},
  notifications: {
    unreadCount: 0,
    toggled: false,
    history: [],
    items: []
  },
  // the actual config object of the page you see right now. This will be
  // moved into the pages lookup once you change pages
  currentPage: {
  },
  // a lookup map for all the widgets which are currently known to the application context
  widgets: {},
  // a lookup map for all the pages which are currently known to the
  // application context. Is used as base for the currentPage and will receive
  // up2date page states from currentPage once you change pages
  pages: {
    'app-project-mynewpage': {
      uuid: 'app-project-mynewpage',
      routeName: 'app.project.mynewpage',
      grid: {
        // a type of vuetify component in which your rows/cols will be wrapped
        type: 'default',
        // type of vuetify component which will wrap your col contents.
        // Currently card/card_flat/default
        items: 'card_flat',
        // amount of colums per row
        columns: 1
      },
      // title of page
      title: 'funoFun',
      // an array from 0-n containing configurations for widgets
      slots: [
        {
          // a css class you want to have on the widget wrapper
          class: 'nice',
          // the width of your widget. represents the flexbox grid numbers from 1-12
          column: 12,
          widget: {
            // the name of the widget, must correspond to the actual folder name the
            // widget files are located in
            name: 'form',
            // and object which you can use to override the widgets default config in the
            // context of this page
            props: {
              title: 'anderer Titel',
              query: {
                q: 'ich bin voll die andere query',
                filter: 'und ich bin ein anderer Filter!'
              }
            }

          }
        },
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
    }
  }
}

/*
 * configPatterns
 * @TODO it seems currently this is not used anywhere?
 */
const configPatterns = {
  grid: {
    // defines the wrapping html template for the whole grid
    type: "default",
    // defines the wrapping html template for the single item within the grid
    items: "card",
    // defines the amount of columns per row
    columns: 3
  },
  slot: {
    // defines a css class which will be used for the v-col the slot widget is housed in
    class: false,
    // defines the width of the widget by using flexbox grid col numbers 1-12
    column: 12,
    // defines the widget configuration, see widget storePattern
    widget: false
  }
}

/*
 * Some data object templates
 */
const storePatterns = {
  page: {
    // this will determine if we always scroll to the last page position or
    // to the top whenever we enter this page
    scrollTop: false,
    // grid config for a page
    grid: configPatterns.grid,
    // the array containing the configs for the 1-n slots
    slots: [],
    tools: false,
    widgets: false,
  },
  widget: {
    // should usually be a i18n key
    title: false,
    // will usually be set automatically, if set manually, be aware that
    // duplicated uuid lead to shared widget store
    uuid: false,
    // the type of widget which represents a folder name under widgets and a config
    name: false,
    // the specific .vue file for the widget
    face: false,
    // a deeper abstractation level for widgets which are used as tools.
    // ie. type:''add' create a folder called 'add' and create a default.vue
    // or FACE.vue containing your add logic for a given widget
    type: false
  }
}

export {
  loadingHold,
  applicationState,
  configPatterns,
  storePatterns,
}
