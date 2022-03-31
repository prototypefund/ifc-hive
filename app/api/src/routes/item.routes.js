const items = require('../itemsDB')
const { getItems, getItem, addItem, deleteItem, updateItem } = require('../controllers/item.controller')

function itemRoute (fastify, options, done) {

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
    schema: {
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
    schema: {
      response: {
        200: itemSchema
      }
    },
    handler: getItem
  }

  /* add items options */
  const addItemOpts = {
    schema: {
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

module.exports = itemRoute
