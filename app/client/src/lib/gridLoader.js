export default function (gridName = 'column_3_cards') {
    //TODO find out why vite alias dont work. Add try catch here
    return import(`../components/templates/grids/${gridName}.vue`).catch(e => {
        return import(`../components/templates/grids/error.vue`)
    })
}
