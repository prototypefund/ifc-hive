<template>
  <v-container v-if="state" data-test-container="pages/settings">
    <h1>{{ $t("pages." + state.uuid) }} - {{ state.title }}</h1>
    <v-row>
      <v-col cols="6">
        <v-card>
          <v-card-title>{{ $t("ui.uiSettings") }}</v-card-title>
          <v-card-text>
            <v-row no-gutters>
              <v-col cols="8">
                {{ $t("ui.editMode") }}: {{ editMode? $t("yes"): $t("no") }}
              </v-col>
              <v-col cols="4">
                <v-switch density="compact" flat v-model="editMode" hide-details />
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="8">
                <span v-if="dark">{{ $t("themeDark") }}</span>
                <span v-else>{{ $t("themeLight") }}</span>
              </v-col>
              <v-col cols="4">
                <v-switch flat density="compact" hide-details v-model="dark" />
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="8"> Daten dazu machne </v-col>
              <v-col cols="4">
                <v-btn @click="addData">addData</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="6">
        <v-card> {{ uiState }}</v-card>
      </v-col>
    </v-row>
    <Grid :contents="state.slots" :grid="state.grid"></Grid>
  </v-container>
</template>

<script setup>
import { useTheme } from "vuetify";
import { inject, shallowRef, onMounted, onUnmounted, computed } from "vue";
import Grid from "@u/grid/loader.vue";
const $store = inject("$store");
const state = shallowRef({});
const uiState = shallowRef({});
const $vuetifyTheme = useTheme();
const stateSubscriber$ = $store
  .select((state) => state.currentPage)
  .subscribe((val) => {
    state.value = val;
  });
const uiStateSubscriber$ = $store
  .select((state) => state.ui)
  .subscribe((val) => {
    uiState.value = val;
  });

const editMode = computed({
  get() {
    return uiState.value.editMode;
  },
  set(val) {
    $store.dispatch({
      type: "ui/update",
      payload: {
        editMode: val,
      },
    });
  },
});
const dark = computed({
  get() {
    return uiState.value.theme === "light" ? false : true;
  },
  set(newValue) {
    const theme = newValue === false ? "light" : "dark";
    $store.dispatch({
      type: "ui/update",
      payload: {
        theme,
      },
    });
    $vuetifyTheme.global.name.value = theme;
  },
});
const props = defineProps({
  urlParams: {
    type: String,
    default: "default param",
  },
});
const addData = () => {
  $store.dispatch({
    type: "data/push",
    uuid: props.uuid,
    payload: {
      data: [
        {
          _id: "test",
          _type: "tag",
          _title: "testTag mit Name",
          _source: {
            title: "testTag mit Name",
            color: "#90A4AE",
          },
        },
        {
          _id: "rolf",
          _type: "memo",
          _project: false,
          _title: "testMemo",
          _source: {
            title: "testMemo",
            path: false, // materialized path
            project: false,
            body: false, // block
            closed: false, // default false
            tags: [], // Type Tag
            created: false,
            modified: false,
            due: false,
            owner: false, // User object
            assigned: false, // User object
            approvals: false,
          },
        },
      ],
    },
  });
};
onMounted(() => { });
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
  uiStateSubscriber$.unsubscribe();
});
function counter() {
  $store.dispatch({
    type: "currentPage/update",
    payload: {
      count: state.value.count + 1 || 0,
    },
  });
}
</script>
