/*
 * Grid loader for pages layout mechanism.
 */
export const gridTypeLoader = function (typeName = 'default') {
  return import(`../app/components/templates/grids/types/${typeName}.vue`).catch(e => {
    return import('../app/components/templates/grids/error.vue')
  })
}

export const gridItemLoader = function (itemName = 'card') {
  return import(`../app/components/templates/grids/items/${itemName}.vue`).catch(e => {
    return import('../app/components/templates/grids/error.vue')
  })
}
