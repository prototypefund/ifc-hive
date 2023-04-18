export default {
  title: 'Boilerplate default config',
  filter: {
    generics: {
      open: {
        query: {
          target: 'meta/tickets',
          params: {
            endless: true,
          }
        },
        title: 'open',
      },
      closed: {
        query: {
          target: 'meta/tickets',
          params: {
            endless: true,
          }
        },
        title: 'closed',
      },
    },
  }
}
