export const applicationState = {
    route: {},
    user: {
        name: false,
        email: false,
        permissions: []
    },
    ui: {
        // indicates the left navigation bar state
        navigationOpen: false,
        // indicates the right quicklist bar state
        quickListOpen: false,
        // indicates if the widget toolbar and other ui edit stuff is displayed
        editMode: false
    },
    quickList: {
        tab: 0,
        tabs: []
    },
    notifications: {
        unreadCount: 0,
        toggled: false,
        history: [],
        items: []
    },
    currentPage: {},
    widgets: {},
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
        // defines the col count
        column: 12,
        // defines the widget configuration, see widget storePattern
        widget: false
    }

}
export const storePatterns = {
    page: {
        loading: true,
        grid: configPatterns.grid,
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