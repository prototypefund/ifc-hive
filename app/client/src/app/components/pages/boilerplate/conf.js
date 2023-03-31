export default {
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
