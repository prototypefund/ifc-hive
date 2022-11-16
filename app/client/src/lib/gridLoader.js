export const gridTypeLoader = function (typeName = 'default') {
    console.log(typeName)
    return import(`../components/templates/grids/types/${typeName}.vue`).catch(e => {
        return import('../components/templates/grids/error.vue')
    })
}
export const gridItemLoader = function (itemName = 'card') {
    console.log(itemName)
    return import(`../components/templates/grids/items/${itemName}.vue`).catch(e => {
        return import('../components/templates/grids/error.vue')
    })
}
