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
 * import package.json so we know our app version
 * @TODO use the new import ... asssert { type: 'json' } method whhen upgrading node.js
 */
import { createRequire } from "module";
const require = createRequire(import.meta.url)
const _package = require('../../package.json')

/*
 * @fastify/swagger openapi-specification configuration
 */
export const swaggerConfig = {
  // show API documentation
  mode: 'dynamic',
  openapi: {
    info: {
      title: 'ifc-hive-api',
      description: `API documenation for the ifc-hive platform.`,
      version: _package.version,
      termsOfService: 'https://www.pacifico/info/term',
      license: { name: 'MIT License', url: 'https://repo.karo.design' },
      contact: {
        name: 'Pacifico Building Data Service UG',
        url: 'https://www.pacifico.info/support'
      }
    },
    externalDocs: {
      url: 'https://ifc-hive.karo.design',
      description: 'Further documentation and guides.'
    },
    tags: [
      { name: 'core/user',
        description: 'Represents a natural person, which belongs to an organization',
        externalDocs: { url: 'https://repo.karo.design', description: 'more about the user concept' }
      },
      { name: 'core/system',
        description: 'Endpoints for system maintenance during development and production',
        externalDocs: { url: 'https://repo.karo.design', description: 'more about the user concept' }
      },
      { name: 'core/organization',
        description: 'User can choose to get notified on state changes.',
        externalDocs: { url: 'https://repo.karo.design', description: 'more about the organization concept' }
      },
      { name: 'core/permission',
        description: 'Represents a privelege.',
        externalDocs: { url: 'https://repo.karo.design', description: 'more about the permission concept' }
      },
      { name: 'core/subscription',
        description: 'User can choose to get notified on state changes.',
        externalDocs: { url: 'https://repo.karo.design', description: 'more about the subscription concept' }
      },
    ],
    components: {
      securitySchemes: {
        apiKey: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
          description: `Use the <bold>POST /core/user/login</bold> API endpoint to create a token. Then use the resulting token as indicated in the following example.<br /><br /> Example \"Bearer $TOKEN\"`
        }
      }
    },
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
  uiConfig: {
    deepLinking: true,
    defaultModelsExpandDepth: 10,
    defaultModelExpandDepth: 10,
    docExpansion: 'list',
  },
  // uiHooks just as a reminder
  uiHooks: {
    onRequest: function (request, reply, next) { next() },
    preHandler: function (request, reply, next) { next() },

  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  exposeRoute: true,
}

export default swaggerConfig
