export const applicationState = {
    route: {},
    user: {
        name: false,
        email: false,
        permissions: []
    },
    ui: {
        navigationOpen: false,
        inspectorOpen: false,
        quickListOpen: false
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
export const storePatterns = {
    page: {
        loading: true,
        slots: []
    },
    widget: {
        title: false,
        uuid: false,
        name: false,
        face: false,
    }
}