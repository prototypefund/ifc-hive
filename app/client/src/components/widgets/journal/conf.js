import { v4 as uuidv4 } from 'uuid';

export default {
  title: 'coming from the state',
  current: false,
  entries: [
    {
      id: 6,
      subject: 'Vorraum nach Installation des Kassentresen',
      content: 'This is some formatted content',
      receivers: ['Daniel', "Christian"],
      date: '2022-07-20T13:22:03Z',
      category: { color: 'warning', title: 'Baudokumentation' },
      locked: 0,
      hash: uuidv4(),
      tags: ['Plan', 'Zwischenstand', 'Vorraum', 'Besichtigung', 'Fehler'],
      images: 3,
      path: [ { text: 'Planung'  }, { text: 'Interne Planung' } ],
    },
    {
      id: 5,
      subject: 'Planungsänderung Aufbau',
      content: 'This is some formatted content',
      receivers: ['Daniel', "Christian"],
      date: '2022-07-20T13:22:03Z',
      category: { color: 'warning', title: 'Planung' },
      locked: 1,
      hash: uuidv4(),
      tags: ['Planung', 'Hamburg'],
      attachments: 2,
      path: [ { text: 'Planung'  }, { text: 'Interne Planung' } ],
      request: [
        {
          name: 'Till Pliestermann',
          approved: null,
          date: null
        },
        {
          name: 'Andreas Ärgerich',
          approved: false,
          date: null
        },
      ]
    },
    {
      id: 4,
      subject: 'Und jetzt mal einer mit einem richtigen langen Titel. Das sollte auch noch verdaulich ausssehen.',
      content: 'This is some formatted content',
      receivers: ['Daniel', "Christian"],
      date: '2022-07-20T13:22:03Z',
      category: { color: 'success', title: 'Memo' },
      locked: 2,
      hash: uuidv4(),
      path: [ { text: 'Planung'  }, { text: 'Interne Planung' } ],
      request: [
        {
          name: 'Paul Krüger',
          approved: true,
          date: '2022-07-20T13:22:03Z',
        },
        {
          name: 'Till Pliestermann',
          approved: true,
          date: '2022-07-20T13:22:03Z',
        },
        {
          name: 'Max Mustermann',
          approved: true,
          date: '2022-07-20T13:22:03Z',
        },
      ]
    },
    {
      id: 3,
      subject: 'Meilenstein Planung geschlossen',
      content: null,
      receivers: ['Daniel', "Christian"],
      date: '2022-07-20T13:22:03Z',
      category: { color: 'blue', title: 'Planung' },
      locked: 3,
      hash: uuidv4(),
      path: [ { text: 'Planung'  }, { text: 'Interne Planung' } ],
      alert: { 
        content: "Meilenstein »Planung« geschlossen",
        color: 'success'
      }
    },
    {
      id: 2,
      subject: 'Schließen von Meilenstein Planung',
      content: 'This is some formatted content',
      receivers: ['Daniel', "Christian"],
      date: '2022-07-20T13:22:03Z',
      category: { color: 'success', title: 'Planung' },
      locked: 3,
      hash: uuidv4(),
      path: [ { text: 'Planung'  }, { text: 'Interne Planung' } ],
      request: [
        {
          name: 'Paul Krüger',
          approved: true,
          date: '2022-07-20T13:22:03Z',
        },
        {
          name: 'Till Pliestermann',
          approved: true,
          date: '2022-07-20T13:22:03Z',
        },
        {
          name: 'Max Mustermann',
          approved: true,
          date: '2022-07-20T13:22:03Z',
        },
      ]
    },
    {
      id: 1,
      subject: 'Third',
      content: 'This is some formatted content',
      receivers: ['Daniel', "Christian"],
      date: '2022-07-20T13:22:03Z',
      category: { color: 'blue', title: 'Memo' },
      locked: 3,
      hash: uuidv4(),
      path: [ { text: 'Planung'  }, { text: 'Interne Planung' } ],
    }
  ]
}
