
import { getSource } from "@lib/dataHelper.js";
export const splitIdentifier = (identifier) => {
    let identifierKeyVal = false
    let identifierKeyValPair = false
    let key = false
    let val = false
    if (identifier.indexOf(';') > -1) {
        key = []
        val = []
        identifierKeyValPair = identifier.split(';')
        identifierKeyValPair.forEach(identifier => {
            identifierKeyVal = identifier.split(':')
            key.push(identifierKeyVal[0])
            val.push(identifierKeyVal[1])
        })
        console.error('not so sure if anything is configured to reveive those two arrays as keyVal for an identifier ' + JSON.stringify({ key, val }))
    } else {
        identifierKeyVal = identifier.split(':')
        key = identifierKeyVal[0]
        val = identifierKeyVal[1]
    }

    return { key, val }
}
export const ticketFetch = function () {

}
export const filterData = function (id, exclude, data) {
    // id[0] contains the prop key and 1 the prop value
    let obj = false
    const tickets = []
    // TODO There should be a better way to do this
    // TODO implement exclude
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            //data entry is now in obj
            obj = getSource(key) || {}
            let dataItemExcluded = false
            if (exclude && exclude.length > 0) {
                exclude.forEach(identifier => {
                    let id = splitIdentifier(identifier)
                    if (obj.hasOwnProperty(id.key)) {
                        // workaround for the boolean/string true/false values which always arrive here as string but might be boolean in data obj
                        let isBoolean = ((id.val === 'true' || id.val === true) || (id.val === 'false' || id.val === false));
                        if (isBoolean) {
                            let isTrueSet = (id.val === 'true');
                            let isFalseSet = (id.val === 'false');
                            if ((isTrueSet && (obj[id.key] === true || obj[id.key] === 'true')) || (isFalseSet && (obj[id.key] === false || obj[id.key] === 'false'))) {
                                dataItemExcluded = true
                            }
                        } else {
                            if (typeof (obj[id.key]) === 'object') {
                                if (obj[id.key].indexOf(id.val) > -1) {
                                    dataItemExcluded = true
                                }
                            }
                            if (typeof (obj[id.key]) === 'string') {
                                if (obj[id.key] == id.val) {
                                    dataItemExcluded = true
                                }
                            }
                        }
                    }
                })

            }
            if (!dataItemExcluded && obj.hasOwnProperty(id.key)) {
                // workaround for the boolean/string true/false values which always arrive here as string but might be boolean in data obj
                let isBoolean = ((id.val === 'true' || id.val === true) || (id.val === 'false' || id.val === false));
                if (isBoolean) {
                    let isTrueSet = (id.val === 'true');
                    let isFalseSet = (id.val === 'false');
                    if ((isTrueSet && (obj[id.key] === true || obj[id.key] === 'true')) || (isFalseSet && (obj[id.key] === false || obj[id.key] === 'false'))) {
                        tickets.push(key)
                    }
                } else {
                    if (typeof (obj[id.key]) === 'object') {
                        if (obj[id.key].indexOf(id.val) > -1) {
                            tickets.push(key)
                        }
                    }
                    if (typeof (obj[id.key]) === 'string') {
                        if (obj[id.key] == id.val) {
                            tickets.push(key)
                        }
                    }
                }
            }
        }
    }

    return tickets
}
