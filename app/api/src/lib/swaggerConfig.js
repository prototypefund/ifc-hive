export default {
  // show API documentation
  exposeRoute: true,
  routePrefix: '/docs',
  swagger: {
    info: {
      title: 'ifc-hive-api',
      description: 'API documenation for the ifc-hive platform.',
      version: '0.0.1'
    },
    externalDocs: {
      url: 'https://ifc-hive.karo.design',
      description: 'FInd more documentation here'
    },
    tags: [
      { name: 'account', description: 'The root entity, all users and other objects belong to an account.' },
      { name: 'user', description: 'Represents a natural person using the app.' },
      { name: 'permission', description: 'Handle account specific roles and for users.' },
      { name: 'note', description: 'A simpel test object for development.' }
    ],
    securityDefinitions: {
      apiKey: {
        description: 'Example: "Bearer {token}"',
        type: 'apiKey',
        name: 'Authorization',
        in: 'header'
      }
    }
  },
  uiConcfig: {
    docExpansion: 'full',
    deepLinking: true,
  }
}
