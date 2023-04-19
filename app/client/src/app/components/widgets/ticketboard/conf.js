export default {
  title: 'Boilerplate default config',
  filter: {
    query: {
      target: 'meta/tickets',
      params: {
        endless: true
      }
    },
    generics: {
      open: {
        query: {
          closed: false
        },
        title: 'open',
      },
      closed: {
        query: {
          closed: true
        },
        title: 'closed',
      },
    },
  }
}
