export const gridTypeLoader = function (typeName = 'default') {
    //TODO find out why vite alias dont work. Add try catch here
    return import(`../components/templates/grids/types/${typeName}.vue`).catch(e => {
        return import(`../components/templates/grids/error.vue`)
    })
}
export const gridItemLoader = function (itemName = 'card') {
    //TODO find out why vite alias dont work. Add try catch here
    return import(`../components/templates/grids/items/${itemName}.vue`).catch(e => {
        return import(`../components/templates/grids/error.vue`)
    })
}