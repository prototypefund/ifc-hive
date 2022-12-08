<template>
  <v-container v-if="state" data-test-container="pages/ticketboard/page" fluid pa-0 ma-0>
    <h1>{{ $t("pages.app-ticketboard") }}</h1>
    <Grid v-if="state.slots" />
  </v-container>
</template>

<script setup>
import { inject, ref, onMounted, onUnmounted } from "vue";
import Grid from "@u/grid/loader.vue";
const $store = inject("$store");
const state = ref({});

const stateSubscriber$ = $store
  .select((state) => state.currentPage)
  .subscribe((val) => {
    state.value = val;
  });

$store.dispatch({
  type: "data/add",
  dummy: true,
  payload: {
    data: [
      {
        _id: "tag-todo",
        title: "ToDo",
        color: "blue",
        tag: true,
      },
      {
        _id: "tag-doing",
        title: "Doing",
        color: "cyan",
        tag: true,
      },
      {
        _id: "tag-test",
        title: "Test",
        color: "orange",
        tag: true,
      },
      {
        _id: "dinierraum",
        title: "kot",
        color: "#0DBC79",
        tag: true,
      },
      {
        _id: "tag-qa",
        title: "Quality Assurance",
        color: "yellow",
        tag: true,
      },
      {
        _id: "tag-done",
        title: "Done",
        color: "green",
        tag: true,
      },
      {
        _id: "RalfSeinMudder",
        title: "don dem seinMudder",
        color: "pink",
      },
      {
        _id: "memo-10",
        closed: false,
        tags: ["badezimmer"],
        title: "Fliesen im Badezimmer",
        ticket: true,
      },
      {
        _id: "memo-1",
        closed: false,
        tags: ["tag-todo", "küche"],
        title: "Fliesen in der Küche",
        ticket: true,
      },
      {
        _id: "memo-2",
        closed: true,
        tags: ["döner", "dinierraum"],
        title: "Fliesen im döner dinierraum",
        ticket: true,
      },
      {
        _id: "memo-3",
        closed: false,
        tags: ["tag-qa", "badezimmer"],
        title: "döner wa",
        ticket: true,
      },
      {
        _id: "memo-4",
        closed: false,
        tags: ["tag-test", "badezimmer"],
        title: "bin test",
        ticket: true,
      },
      {
        _id: "memo-5",
        closed: false,
        tags: ["tag-todo", "badezimmer"],
        title: "bintodo",
        ticket: true,
      },
      {
        _id: "memo-6",
        closed: false,
        tags: ["tag-doing", "mache"],
        title: "werde gemacht",
        ticket: true,
      },
      {
        _id: "memo-8",
        closed: true,
        tags: ["tag-done", "RalfSeinMudder"],
        title: "die is risch durch",
        ticket: true,
      },
      {
        _id: "memo-9",
        closed: false,
        tags: ["tag-todo", "badezimmer"],
        title: "dönerTodo",
        ticket: true,
      },
    ],
  },
});

$store.dispatch({
  type: "toolbar/add",
  payload: {
    title: "ticketsByTag",
    page: "app.ticketboard",
    icon: "mdi-chart-donut",
    iconActive: "mdi-chart-donut-variant",
    uuid: "chart_ticketsByTag",
    widget: {
      name: "ticketboard",
      type: "chart",
      face: "ticketsByTag",
      props: {
        categories: [
          "tags:tag-todo",
          "tags:tag-doing",
          "tags:tag-test",
          "tags:tag-qa",
          "tags:tag-done",
        ],
      },
    },
  },
});

onMounted(() => {});
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
});
</script>
