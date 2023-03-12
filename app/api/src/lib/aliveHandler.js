/*
 * Alive Handler
 *
 * This function can be used as a helper handler during development, e.g. when
 * setting up new API endpoints.
 * It has the same signature as all handlers (req, res) and returns some vital
 * informations such as
 *   - requested url
 *   - request ID
 *   - request method
 *   - body
 *   - params
 *   - query string
 */

/*
 * alive handler
 *
 * @param {object} req - request object
 * @param {object} res - response object
 */
export function aliveHandler (req, res) {
  res.send({
    url: req.url,
    routerPath: req.routerPath,
    requestId: req.id,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
  })
}

/*
 * alive handler schema for route definition
 * @TODO use as shared schema
 * @TODO test body, params and query properties
 */
export const aliveHandlerSchema = {
  type: 'object',
  properties: {
    url: { type: 'string' },
    routerPath: { type: 'string' },
    requestId: { type: 'string' },
    method: { type: 'string' },
    body: { type: 'object' },
    params: { type: 'array' },
    query: { type: 'array' },
  }
}
