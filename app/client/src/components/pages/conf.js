export default {
    dashboard: {
        grid: 'column_3_cards',
        title: 'the lutzness of life',
        slots: [
            {
                column: 'v-col-12',
                widget: {
                    name: 'timeline',
                    props: {
                        query: {
                            q: 'moin'
                        },
                        title: 'Widget 1',
                    }
                }
            },
            {
                column: 'v-col-6',
                widget: {
                    name: 'timeline',
                    props: {
                        title: 'anderer Titel',
                        query: {
                            q: 'ich bin voll die andere query',
                            filter: 'und ich bin ein anderer Filter!'
                        }
                    }
                }
            }, {
                column: 'v-col-6',
                widget:
                {
                    uuid: 'currPageDebug',
                    name: 'debug',
                    props: {
                        type: 'currentPage'
                    }
                }
            },
        ],
        count: 0,
    },
    settings: {
        grid: 'column_3_cards_dark',
        title: 'the rolfness of life',
        slots: [
            {
                column: 'v-col-6',
                widget: {
                    uuid: 'currPageDebug',
                    name: 'debug',
                    props: {
                        type: 'pages'
                    }

                }
            }, {
                column: 'v-col-6',
                widget:
                {
                    uuid: 'currPageDebug',
                    name: 'debug',
                    props: {
                        type: 'currentPage'
                    }
                }
            }, {
                column: 'v-col-12',
                widget:
                {
                    uuid: 'currPageDebug',
                    name: 'debug',
                    props: {
                        type: 'widgets'
                    }
                }
            },
        ]
    }
}