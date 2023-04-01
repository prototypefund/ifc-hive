export default {
  grid: false,
  slots: false,
  hasInspector: true,
  widgets: [{
    uuid: "ticketBoardWidget",
    name: 'ticketboard', // the name of the widget, must correspond to the actual folder name the widget files are located in
    face: 'default',
    props: { // and object which you can use to override the widgets default config in the context of this page
      title: 'Ticketboard',
      filter: {
        excluded: [],
        custom: [
          {
            identifier: ['tags:tag-todo'],
            excluded: [],
          },
          {
            identifier: ['tags:tag-doing'],
            excluded: [],
          },
          {
            identifier: ['tags:tag-test'],
            excluded: [],
          },
          {
            identifier: ['tags:tag-qa'],
            excluded: [],
          },
          {
            identifier: ['tags:tag-done'],
            excluded: [],
          }
        ]
      }
    }
  }],

}