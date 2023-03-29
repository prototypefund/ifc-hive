export default {
  grid: {
    type: "default",
    items: "card_flat",
    columns: 1
  },
  slots: [
    {
      column: 12,
      widget: {
        uuid: "journalWidget",
        name: "journal",
        props: {
          test: "huhu"
        }
      }
    }
  ],
  hasInspector: true,
  inspectorTools: [{
    title: "chartJournal",
    pages: ["app.journal"],
    icon: "mdi-chart-donut",
    uuid: "journal_chart",
    widget: {
      name: "journal",
      type: "chart",
      face: "example",
    },
  }]
}