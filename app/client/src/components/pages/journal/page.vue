<template>
  <v-container data-test-container="pages/journal" fluid pa-0>
    <Grid></Grid>
  </v-container>
</template>

<script setup>
import { inject, shallowRef, onMounted, onUnmounted } from "vue";
import Grid from "@u/grid/loader.vue";
const $store = inject("$store");
const state = shallowRef({});

const stateSubscriber$ = $store
  .select((state) => state.currentPage)
  .subscribe((val) => {
    state.value = val;
  });

const props = defineProps({
  urlParams: {
    type: String,
    default: "default param",
  },
});

onMounted(() => {
  $store.dispatch({
    type: "currentPage/update",
    payload: {
      loading: false,
    },
  });
  $store.dispatch({
    type: "data/add",
    payload: {
      data: [
        {
          id: '6',
          subject: 'Vorraum nach Installation des Kassentresen',
          content: 'This is some formatted content',
          receivers: ['Daniel', "Christian"],
          date: '2022-07-20T13:22:03Z',
          category: { color: 'warning', title: 'Baudokumentation' },
          locked: 0,
          _id: '068-68498vf',
          tags: ['Plan', 'Zwischenstand', 'Vorraum', 'Besichtigung', 'Fehler'],
          images: 3,
          path: [{ text: 'Planung' }, { text: 'Interne Planung' }],
        },
        {
          id: '5',
          subject: 'Planungsänderung Aufbau',
          content: 'This is some formatted content',
          receivers: ['Daniel', "Christian"],
          date: '2022-07-20T13:22:03Z',
          category: { color: 'warning', title: 'Planung' },
          locked: 1,
          _id: 'd6e-2d5e',
          tags: ['Planung', 'Hamburg'],
          attachments: 2,
          images: 1,
          path: [{ text: 'Planung' }, { text: 'Interne Planung' }],
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
          id: '4',
          subject: 'Und jetzt mal einer mit einem richtigen langen Titel. Das sollte auch noch verdaulich ausssehen.',
          content: 'This is some formatted content',
          receivers: ['Daniel', "Christian"],
          date: '2022-07-20T13:22:03Z',
          category: { color: 'success', title: 'Memo' },
          locked: 2,
          _id: '89e-85d8e',
          path: [{ text: 'Planung' }, { text: 'Interne Planung' }],
          images: 10,
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
          id: '3',
          subject: 'Meilenstein Planung geschlossen',
          content: null,
          receivers: ['Daniel', "Christian"],
          date: '2022-07-20T13:22:03Z',
          category: { color: 'blue', title: 'Planung' },
          locked: 3,
          _id: '156ae-6542e8',
          path: [{ text: 'Planung' }, { text: 'Interne Planung' }],
          alert: {
            content: "Meilenstein »Planung« geschlossen",
            color: 'success'
          }
        },
        {
          id: '2',
          subject: 'Schließen von Meilenstein Planung',
          content: 'This is some formatted content',
          receivers: ['Daniel', "Christian"],
          date: '2022-07-20T13:22:03Z',
          category: { color: 'success', title: 'Planung' },
          locked: 3,
          _id: '4ea-6542e8',
          path: [{ text: 'Planung' }, { text: 'Interne Planung' }],
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
          id: '1',
          subject: 'Third',
          content: 'This is some formatted content',
          receivers: ['Daniel', "Christian"],
          date: '2022-07-20T13:22:03Z',
          category: { color: 'blue', title: 'Memo' },
          locked: 3,
          _id: '89e-6esfafe8',
          path: [{ text: 'Planung' }, { text: 'Interne Planung' }],
        }
      ]
    }
  })
  $store.dispatch({
    type: "toolbar/add",
    payload: {
      title: 'newJournal',
      page: 'app.journal',
      icon: 'mdi-content-save-edit-outline',
      iconActive: 'mdi-content-save-edit',
      widget: {
        name: 'journal',
        type: 'add',
        uuid: 'journal_add'
      }
    },
  });
  $store.dispatch({
    type: "toolbar/add",
    payload: {
      title: 'chartJournal',
      page: 'app.journal',
      icon: 'mdi-chart-donut',
      iconActive: 'mdi-chart-donut-variant',
      widget: {
        name: 'journal',
        type: 'chart',
        face: 'example',
        uuid: 'journal_chart'
      }
    },
  });
});
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
  $store.dispatch({
    type: "currentPage/update",
    payload: {
      loading: true,
    },
  });
});
</script>
