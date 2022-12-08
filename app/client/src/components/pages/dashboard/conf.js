export default {
    grid: {
        type: "default",
        items: "card_flat",
        columns: 1
    },
    title: "funoFun",
    slots: [
        {
            class: "nice",
            column: 12,
            widget: {
                name: "timeline",
                props: {
                    title: "anderer Titel",
                    query: {
                        q: "ich bin voll die andere query",
                        filter: "und ich bin ein anderer Filter!"
                    }
                }
            }
        }
    ]
}