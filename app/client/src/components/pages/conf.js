export default {
    dashboard: {
        title: 'the lutzness of life',
        count: 0,
        config: {
            widgets: [{
                name: 'timeline',
                props: {
                    query: {
                        q: 'moin'
                    }
                },
                title: 'Widget 1',
                slot: 'default'
            }]
        }
    },
    settings: {
        title: 'the rolfness of life',
        config: {
        }


    }
}