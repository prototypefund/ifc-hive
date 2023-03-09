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
      { name: 'core/user',
        description: 'Represents a natural person, which belongs to an organization'
      },
      { name: 'core/organization',
        description: 'User can choose to get notified on state changes.'
      },
      { name: 'core/permission',
        description: 'Represents a privelege.'
      },
      { name: 'core/subscription',
        description: 'User can choose to get notified on state changes.'
      },
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
 *
 * Since the last major update the swagger interface comes in its own plugin
 * and with its own configuration.
 */
export const swaggerUiConfig = {
  routePrefix: '/docs',
  uiConcfig: {
    docExpansion: 'full',
    deepLinking: true,
    defaultModelsExpandDepth: 5,
    defaultModelExpandDepth: 5,
    defaultModelRendering: 'model'
  },
  // uiHooks just as a reminder
  uiHooks: {
    onRequest: function (request, reply, next) { next() },
    preHandler: function (request, reply, next) { next() }

  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  exposeRoute: true
}

export default swaggerConfig
