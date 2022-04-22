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
      url: 'https://docs.ifc-hive.com',
      description: 'FInd more documentation here'
    },
    tags: [
      { name: 'note', description: 'Test object note' }
    ],
    securityDefinitions: {
      apiKey: {
        description: 'Authorization header token, sample: "Bearer #TOKEN#"',
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
