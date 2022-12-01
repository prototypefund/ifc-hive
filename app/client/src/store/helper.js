export default {
    subscribe: () => {

    },
    unSubscribeAll: (subscriberList$) => {
        if (subscriberList$.length > 0) {
            subscriberList$.forEach(subscriber$ => {
                subscriber$.unsubscribe()
            })
        }
    },
}