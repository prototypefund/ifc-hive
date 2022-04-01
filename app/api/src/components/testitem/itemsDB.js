/*
 * A simple db for research purposes
 */

/* items db */
export let items = [
  { id: '1', name: 'Item One' },
  { id: '2', name: 'Item Two' },
  { id: '3', name: 'Item Three' },
]

/* since modules are immutuble we need a funciton to modify our items db */
export function modifyItems (newItems) {
  items = newItems
}

export default items
