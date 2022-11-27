export const applicationState = {
    route: {},
    data: {},
    user: {
        name: false,
        email: false,
        permissions: []
    },
    ui: {
        // indicates the left navigation bar state
        navigationOpen: false,
        // indicates the currently selected Tool for the toolbar
        currentTool: false,
        // indicates if the widget toolbar and other ui edit stuff is displayed
        editMode: false,
    },
    // will contain tools. Logic behind that is the same as with pages
    toolbar: {},
    notifications: {
        unreadCount: 0,
        toggled: false,
        history: [],
        items: []
    },
    // the actual config object of the page you see right now. This will be moved into the pages lookup once you change pages
    currentPage: {
    },
    // a lookup map for all the widgets which are currently known to the application context
    widgets: {},
    // a lookup map for all the pages which are currently known to the application context. Is used as base for the currentPage and will receive up2date page states from currentPage once you change pages
    pages: {}
}
export const configPatterns = {
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
export const storePatterns = {
    page: {
        // obvious
        loading: true,
        // grid config for a page
        grid: configPatterns.grid,
        // the array containing the configs for the 1-n slots
        slots: []
    },
    widget: {
        // should usually be a i18n key
        title: false,
        // will usually be set automatically, if set manually, be aware that duplicated uuid lead to shared widget store
        uuid: false,
        // the type of widget which represents a folder name under widgets and a config
        name: false,
        // the specific .vue file for the widget
        face: false,
    }
}