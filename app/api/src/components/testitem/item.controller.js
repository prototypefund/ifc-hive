/* eslint-disable no-import-assign */
import { v4 as uuidv4 } from 'uuid'
import { items, modifyItems } from './itemsDB.js'

/* get all items */
export function getItems (req, reply) {
  reply.send(items)
}

/* get item */
export function getItem (req, reply) {
  const { id } = req.params
  const item = items.find(i => i.id === id)
  this.assert(item, 404)
  reply.send(item)
}

/* add item */
export function addItem (req, reply) {
  const { name } = req.body
  const item = {
    id: uuidv4(),
    name,
  }
  modifyItems([...items, item])

  reply.code(201).send(item)
}

/* delete item */
export function deleteItem (req, reply) {
  const { id } = req.params
  modifyItems(items.filter(i => i.id !== id))

  reply.send({ message: `Item ${id} has been removed` })
}

/* update item */
export function updateItem (req, reply) {
  const { id } = req.params
  const { name } = req.body
  modifyItems(items.map(item => (item.id === id) ? { id, name } : item))
  const item = items.find(item => item.id === id)

  reply.send(item)
}
