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
        name: "journal"
      }
    }
  ],
  tools: [{
    title: "chartJournal",
    page: "app.journal",
    icon: "mdi-chart-donut",
    iconActive: "mdi-chart-donut-variant",
    uuid: "journal_chart",
    widget: {
      name: "journal",
      type: "chart",
      face: "example",
    },
  }]
}