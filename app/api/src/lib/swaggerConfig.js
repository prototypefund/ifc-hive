const swaggerConfig = {
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
      { name: 'item', 'description': 'Test item related end-points' }
    ]
  },
  uiConcfig: {
    docExpansion: 'full',
    deepLinking: true,
  }
}

module.exports = swaggerConfig
