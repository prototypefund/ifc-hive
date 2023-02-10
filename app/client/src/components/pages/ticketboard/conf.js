export default {
    grid: {
        type: 'default', // a type of vuetify component in which your rows/cols will be wrapped
        items: 'card_flat', // a type of vuetify component which will wrap your col contents. Currently card/card_flat/default
        columns: 1 // amount of columns per row
    },
    title: 'Ticketboard', // title of the page
    slots: [ // an array from 0-n containing configurations for widgets
        {
            class: 'nice', // a css class you want to have on the widget wrapper
            column: 12, // the width of your widget. represents the flexbox grid numbers from 1-12
            widget: {

                uuid: "ticketBoardWidget",
                name: 'ticketboard', // the name of the widget, must correspond to the actual folder name the widget files are located in
                face: 'heavy',
                props: { // and object which you can use to override the widgets default config in the context of this page
                    title: 'Ticketboard',
                    filter: {
                        excluded: [],
                        custom: [
                            {
                                identifier: 'tags:tag-todo',
                                excluded: [],
                            },
                            {
                                identifier: 'tags:tag-doing',
                                excluded: [],
                            },
                            {
                                identifier: 'tags:tag-test',
                                excluded: [],
                            },
                            {
                                identifier: 'tags:tag-qa',
                                excluded: [],
                            },
                            {
                                identifier: 'tags:tag-done',
                                excluded: [],
                            }
                        ]
                    }
                }
            }
        },
    ],
}