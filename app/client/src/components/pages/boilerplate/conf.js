export default {
    grid: {
        type: 'default', // a type of vuetify component in which your rows/cols will be wrapped
        items: 'card_flat', // a type of vuetify component which will wrap your col contents. Currently card/card_flat/default
        columns: 1 // amount of columns per row
    },
    title: 'funoFun', // title of the page
    slots: [ // an array from 0-n containing configurations for widgets
        {
            class: 'nice', // a css class you want to have on the widget wrapper
            column: 12, // the width of your widget. represents the flexbox grid numbers from 1-12
            widget: {
                name: 'timeline', // the name of the widget, must correspond to the actual folder name the widget files are located in
                props: { // and object which you can use to override the widgets default config in the context of this page
                    title: 'anderer Titel',
                    query: {
                        q: 'ich bin voll die andere query',
                        filter: 'und ich bin ein anderer Filter!'
                    }
                }
            }
        },
    ],
}