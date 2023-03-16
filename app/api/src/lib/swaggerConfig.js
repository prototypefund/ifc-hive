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
      title: 'Pacifico Projektjournal API',
      description: `API documenation for the pacifico-projectjournal-api platform. Further information
         <ul>
          <li>Further documentation in the repo</li>
          <li>General request atonomy</li>
          <li>Managing the socket in the client</li>
          <li>Search queries with example use cases</li>
        </ul>`,
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
      description: 'Further documentation and guides'
    },
    tags: [
      { name: 'core/account',
        description: 'Represents a legal entity, which can manage their own users and projects.',
        externalDocs: { url: 'https://repo.karo.design', description: 'more about the user concept' }
      },
      { name: 'core/project',
        description: 'Represents the default scope for permissions, belongs to an account and has users and a root-memo assigned.',
        externalDocs: { url: 'https://repo.karo.design', description: 'more about the user concept' }
      },
      { name: 'core/user',
        description: 'Represents a natural person, belongs to an account and optionally to an organization',
        externalDocs: { url: 'https://repo.karo.design', description: 'more about the user concept' }
      },
      { name: 'core/organization',
        description: 'Users can optionally refer to an organization, to avoid redundancy and for search and batch operations.',
        externalDocs: { url: 'https://repo.karo.design', description: 'more about the organization concept' }
      },
      { name: 'core/permission',
        description: 'Represents various priveleges such as read/write access and subscriptions.',
        externalDocs: { url: 'https://repo.karo.design', description: 'more about the permission concept' }
      },
      { name: 'core/group',
        description: 'Users belonging to a group inherit permissions granted to that group.',
        externalDocs: { url: 'https://repo.karo.design', description: 'more about the group concept' }
      },
      { name: 'core/tag',
        description: 'Represents a label. Labels live in the context of a given project.',
        externalDocs: { url: 'https://repo.karo.design', description: 'more about the tag concept' }
      },
      { name: 'core/system',
        description: 'Endpoints for system maintenance during development and production',
        externalDocs: { url: 'https://repo.karo.design', description: 'more about system operations' }
      },
      { name: 'journal/ticket',
        description: 'The unified object in a project tree, represents a memo, documentation, ticket, milestone, approval request etc.',
        externalDocs: { url: 'https://repo.karo.design', description: 'more about the ticket concept' }
      },
      { name: 'journal/register',
        description: 'Registers are the nodes and agents in the blockchain network.',
        externalDocs: { url: 'https://repo.karo.design', description: 'more about the user concept' }
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
  deepLinking: true,
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
