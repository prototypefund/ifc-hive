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
                }
            }
        }
    ]
}