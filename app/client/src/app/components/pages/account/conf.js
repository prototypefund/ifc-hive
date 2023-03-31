export default {
  grid: {
    type: 'default', // a type of vuetify component in which your rows/cols will be wrapped
    items: 'card_flat', // a type of vuetify component which will wrap your col contents. Currently card/card_flat/default
    columns: 1 // amount of columns per row
  },
  title: 'funoFun', // title of the page
  slots: [ // an array from 0-n containing configurations for widgets
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
