/*
 * Swagger OpenAPI configuration. 
 *
 * Since fastify 4 and swagger 8 the dynamic generation and the swagger/openapi-speficiation
 * and the public swagger-front-end are split into two distinct fastify plugins, each with
 * its onw configuration object.
 *
 * For furhter information see:
 * https://github.com/fastify/fastify-swagger/blob/master/MIGRATION.md
 */

/*
 * @fastify/swagger openapi-specification configuration
 */
export const swaggerConfig = {
  // show API documentation
  mode: 'dynamic',
  openapi: {
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
      { name: 'user', description: 'Represents a natural person, which belongs to an organization' },
      { name: 'organization', description: 'Represents an organization' },
      { name: 'project', description: 'Represents the project or child-project scope for a Projectjournal' },
      { name: 'memo', description: 'Represents a memo (a.k.a. ticket, issue, note) in the scope of a project' },
      { name: 'tag', description: 'Represents a label to be attached to a memo. Tags exists in the scope of a project.' },
      { name: 'permission', description: 'Represents user/project specific roles' },
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
}

/*
 * @fastify/swagger-ui configuration
 */
export const swaggerUiConfig = {
  routePrefix: '/docs',
  uiConcfig: {
    docExpansion: 'full',
    deepLinking: true,
  },
  // uiHooks just as a reminder
  uiHooks: {
    onRequest: function (request, reply, next) { next() },
    preHandler: function (request, reply, next) { next() }
  },
  staticCSP: true,
  transformStaticCSP: (header) => header
}

export default swaggerConfig
