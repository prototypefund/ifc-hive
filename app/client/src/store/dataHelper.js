import { filter, propEq, find, forEachObjIndexed } from 'ramda'

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
export const isTrueFalse = (value) => {
    return ((value === 'true' || value === true) || (value === 'false' || value === false));
}
export const isTrue = (value) => {
    return value === true || value === 'true'
}
export const isFalse = (value) => {
    return value === false || value === 'false'
}


export const basicStoreFilters = (query, params, _data) => {
    let data = JSON.parse(JSON.stringify(_data))
    let identifier = false, excluded = {}
    if (query === "ALL_MEMOS") {
        data = filter((item) => {
            return item._type === 'memo'
        }, data)
    }
    if (query === "ALL_TAGS") {
        data = filter((item) => {
            return item._type === 'tag'
        }, data)
    }
    if (query === "ALL_USER") {
        data = filter((item) => {
            return item._type === 'user'
        }, data)
    }
    if (query === "ALL_PROJECTS") {
        data = filter((item) => {
            return item._type === 'project'
        }, data)
    }
    if (query === "ALL_ORGANIZATIONS") {
        data = filter((item) => {
            return item._type === 'organization'
        }, data)
    }
    if (params) {
        if (params.identifier) {
            identifier = splitIdentifier(params.identifier)
            // find the items which match the identifier
            data = filter((item) => {
                if (!item._source.hasOwnProperty(identifier.key)) {
                    return false
                }
                if (isTrueFalse(identifier.val)) {
                    if (isTrue(identifier.val)) {
                        return item._source[identifier.key] === true || item._source[identifier.key] === 'true'
                    }
                    if (isFalse(identifier.val)) {
                        return item._source[identifier.key] === false || item._source[identifier.key] === 'false'
                    }
                } else {
                    if (typeof (item._source[identifier.key]) === 'object') {
                        return item._source[identifier.key].indexOf(identifier.val) > -1
                    }
                    if (typeof (item._source[identifier.key]) === 'string') {
                        return item._source[identifier.key] == identifier.val
                    }
                }
            }, data)
            if (params.excluded) {
                // create a exclude object sorted by field name and a list of excluded contents
                params.excluded.forEach(excludeItem => {
                    const id = splitIdentifier(excludeItem)
                    if (!excluded[id.key]) {
                        excluded[id.key] = []
                    }
                    excluded[id.key].push(id.val)
                })
                data = filter((item) => {
                    // find and remove the excluded elements from our search result
                    let bail = false
                    forEachObjIndexed(((val, key) => {
                        // if we don't have the exclude field afterall, we can't fail can't we?
                        if (!item._source.hasOwnProperty(key)) {
                            return true
                        }
                        if (isTrueFalse(val)) {
                            if (isTrue(val)) {
                                bail = item._source[key] === true || item._source[key] === 'true'
                            }
                            if (isFalse(val)) {
                                bail = item._source[key] === false || item._source[key] === 'false'
                            }
                        } else {
                            if (key !== 'tags') {
                                console.error('so far there is just a filter based on arrays, strings and true false values allowed')
                            }
                            if (typeof (item._source[key]) === 'object') {
                                val.forEach(exclude => {
                                    // if we find one of the excluded array items in our current data item, we'll bail on it
                                    if (item._source[key].indexOf(exclude) > -1) {
                                        return bail = true
                                    }
                                })
                            }
                            if (typeof (item._source[key]) === 'string') {
                                // if the property contains or is the no no value we exclude it 
                                if (item._source[key].indexOf(val) > -1 || item._source[key] == val) {
                                    return bail = true
                                }
                            }
                        }
                    }), excluded);
                    return !bail;
                }, data)
            }

        }
    }
    return data
}
