export default {
    dashboard: {
        title: 'the lutzness of life',
        config: {
            widgets: [{
                name: 'timeline',
                props: {
                    query: {
                        q: 'moin'
                    }
                },
                title: 'Widget 1',
                slot: 0
            }, {
                name: 'widget1',
                title: 'Widget 1',
                slot: 1
            }]
        }
    },
    settings: {
        title: 'the rolfness of life',
        config: {
            widgets: [{
                name: 'widget1',
                title: 'Widget 1',
                slot: 0
            }]
        }


    }
}