import { createArrayExpression } from '@vue/compiler-core'

const resolveData = (x) => {
    const result = []
    for (const index in x) {
        const uuid = x[index].uuid
        const name = x[index].name
        var face = x[index].face
        if (!face) {
            face = 'default'
        }
        result.push({ uuid, name, face })
    }
    return result
}

const getSlotWidgets = () => {
    const slots0 = Cypress.__store.currentPage.slots
    var slots = []

    for (const i in slots0) {
        slots.push(slots0[i].widget)
    }
    return resolveData(slots)
}


/**
 * 
 * @returns Wrapped Object
 */
const getSlotWidgetsWrapped = () => {
    return cy.wrap(getSlotWidgets());
    /*
    return cy.window().then((win) => {
        var slots = []
        for (const i in win.__currentPage.slots) {
            slots.push(win.__currentPage.slots[i].widget)
        }
        return resolveData(slots)
    })*/
}


const getAllWidgets = () => {


    return cy.window().then((win) => {
        var widgets = {}
        for (const uuid in win.__widgets) {
            widgets[uuid] = win.__widgets[uuid]
        }
        return resolveData(widgets)
    })
}

export {
    getSlotWidgets, getSlotWidgetsWrapped, getAllWidgets
};
