import { getItems, getItem, addItem, deleteItem, updateItem } from '../controllers/item.controller.js'

export default function itemRoutes (fastify, options, done) {
  /* item schema */
  const itemSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' }
    }
  }

  /* get all items options */
  const getItemsOpts = {
    // constraints: { version: '1.2.1' },
    schema: {
      tags: ['item'],
      summary: 'Get all items',
      description: 'Get all test items',
      response: {
        200: {
          type: 'array',
          items: itemSchema
        }
      }
    },
    handler: getItems,
  }

  /* get item options */
  const getItemOpts = {
    constraints: { version: '1.2.1' },
    schema: {
      tags: ['item'],
      description: 'Some description for this rest end-point',
      params: {
        id: { type: 'string', default: '1' },
      },
      query: {
        format: { type: 'string', enum: ['tree', 'list'], default: 'list' }
      },
      headers: {
        'Accept-Version': { type: 'string', default: '1.x', example: '*', }
      },
      response: {
        200: itemSchema
      }
    },
    handler: getItem
  }

  /* add items options */
  const addItemOpts = {
    schema: {
      tags: ['item'],
      description: 'Add new item',
      body: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string' }
        }
      },
      response: {
        201: itemSchema,
      }
    },
    handler: addItem
  }

  /* delete item options */
  const deleteItemOpts = {
    schema: {
      tags: ['item'],
      description: 'Delete single item by id',
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    },
    handler: deleteItem
  }

  /* update item options */
  const updateItemOpts = {
    schema: {
      tags: ['item'],
      description: 'Update single item',
      body: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string' },
          id: { type: 'string' }
        }
      },
      response: {
        200: itemSchema
      },
    },
    handler: updateItem,
  }

  /* get all items */
  fastify.get('/items', getItemsOpts)
  /* get single item */
  fastify.get('/items/:id', getItemOpts)
  /* add single item */
  fastify.post('/items', addItemOpts)
  /* delete single item */
  fastify.delete('/items/:id', deleteItemOpts)
  /* update single item */
  fastify.put('/items/:id', updateItemOpts)

  /* don't forget to call done */
  done()
}
