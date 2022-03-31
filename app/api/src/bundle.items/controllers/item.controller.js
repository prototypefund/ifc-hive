/* eslint-disable no-import-assign */
import { v4 as uuidv4 } from 'uuid'
import { items, modifyItems } from '#src/bundle.items/itemsDB'

/* get all items */
export const getItems = (req, reply) => {
  reply.send(items)
}

/* get item */
export const getItem = (req, reply) => {
  const { id } = req.params
  const item = items.find(i => i.id === id)
  reply.send(item)
}

/* add item */
export const addItem = (req, reply) => {
  const { name } = req.body
  const item = {
    id: uuidv4(),
    name,
  }
  modifyItems([...items, item])

  reply.code(201).send(item)
}

/* delete item */
export const deleteItem = (req, reply) => {
  const { id } = req.params
  modifyItems(items.filter(i => i.id !== id))

  reply.send({ message: `Item ${id} has been removed` })
}

/* update item */
export const updateItem = (req, reply) => {
  const { id } = req.params
  const { name } = req.body
  modifyItems(items.map(item => (item.id === id) ? { id, name } : item))
  const item = items.find(item => item.id === id)

  reply.send(item)
}
