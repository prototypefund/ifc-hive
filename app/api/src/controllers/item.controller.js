let items = require('../itemsDB')
const { v4:uuidv4 } = require('uuid')

/* get all items */
const getItems = (req, reply) => {
  reply.send(items)
}


/* get item */
const getItem = (req, reply) => {
  const { id } = req.params
  const item = items.find(i => i.id === id)
  reply.send(item)
}

/* add item */
const addItem = (req, reply) => {
  const { name } = req.body
  const  item = {
    id: uuidv4(),
    name,
  }

  items = [...items, item]

  reply.code(201).send(item)
}

/* delete item */
const deleteItem = (req, reply) => {
  const { id } = req.params
  items = items.filter(i => i.id !== id)

  reply.send({ message : `Item ${id} has been removed` })
}

/* update item */
const updateItem = (req, reply) => {
  const { id } = req.params
  const { name } = req. body
  items = items.map(item => (item.id === id) ? { id, name } : item)
  const item = items.find(item => item.id === id)

  reply.send(item)
}

/* export */
module.exports = {
  getItems,
  getItem,
  addItem,
  deleteItem,
  updateItem,
}
