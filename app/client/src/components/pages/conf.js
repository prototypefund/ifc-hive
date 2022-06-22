export default {
    dashboard: {
        grid: 'column_3_cards',
        title: 'the lutzness of life',
        slots: [
            {
                column: 'v-col-6'
            },
            {
                column: 'v-col-6'
            },
        ],
        count: 0,
        config: {
            widgets: [{
                name: 'timeline',
                props: {
                    query: {
                        q: 'moin'
                    },
                    title: 'Widget 1',
                },
                slot: 0
            }, {
                name: 'timeline',
                props: {
                    title: 'anderer Titel',
                    query: {
                        q: 'ich bin voll die andere query',
                        filter: 'und ich bin ein anderer Filter!'
                    }
                },
                slot: 1
            },
            {
                uuid: 'currPageDebug',
                name: 'debug',
                slot: 2
            }]
        }
    },
    settings: {
        grid: 'column_3_cards_dark',
        title: 'the rolfness of life',
        slots: [
            {
                column: 'v-col-12'
            }
        ],
        config: {
            widgets: [{
                uuid: 'currPageDebug',
                name: 'debug',
                slot: 0
            }]
        }
    }
}