export default {
    grid: {
        type: "default",
        items: "card_flat",
        columns: 1
    },
    title: "funoFun",
    slots: [
        {
            column: 12,
            widget: {
                name: "itemBoard",
                uuid: "itemBoard",
                props: {
                    title: "anderer Titel",
                }
            }
        }
    ]
}