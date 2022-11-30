export default {
  title: 'Boilerplate default config',
  filter: {
    identifier: 'ticket:true',
    generics: [
      {
        identifier: 'closed:false',
        excluded: [],
        title: 'open'
      },
      {
        identifier: 'closed:true',
        excluded: [],
        title: 'closed'
      },
    ],
  }
}
