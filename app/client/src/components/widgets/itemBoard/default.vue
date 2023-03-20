<template>
  <v-card flat class="itemBoardWrapper" v-if="state" data-test-container="widgets/itemBoard/default"
    :data-test-container-uuid="props.uuid">
    <v-tabs v-model="openItem" fixed-tabs v-if="state.entries.length > 0" density="compact">
      <v-tab v-for="(item, index) in state.entries" :key="item" @click.middle="closeTab(index)" class="itemBoardTab">
        <div class="tabTitle text-h6 text-truncate">
          {{ item.type }} - {{ item.title }}
        </div>
        <v-icon class="tabHandler" @click="closeTab(index)">mdi-close-octagon</v-icon>
      </v-tab>
    </v-tabs>
    <v-window v-model="openItem" class="tabScrollContainer">
      <v-window v-if="!state.entries || state.entries.length === 0">
        <no-results-yet />
      </v-window>
      <v-window-item v-else v-for="(item, index) in state.entries" :key="item">
        <component :props="item.props" :widgetUUID="props.uuid" :docUUID="item.uuid" />
      </v-window-item>
    </v-window>
  </v-card>
</template>
<script setup>
import { inject, ref, onMounted, onUnmounted, computed, defineAsyncComponent } from "vue";
import noResultsYet from "@t/noResultsYet.vue";
const $store = inject("$store");
const state = ref({});

const stateSubscriber$ = $store
  .select((state) => state.widgets[props.uuid])
  .subscribe((val) => {
    state.value = val;
  });
const component = computed(() => {
  const currState = state.value;
  let component = "";
  if (currState.entries && currState.entries[currState.openItem].template) {
    component = import(`../${currState.entries[currState.openItem].template}.vue`);
  } else {
    component = import(`./types/${currState.entries[currState.openItem].type}.vue`);
  }
  return defineAsyncComponent(() => component);
});
const openItem = computed({
  // getter
  get() {
    return state.value.openItem || 0;
  },
  // setter
  set(newValue) {
    $store.dispatch({
      type: "widgets/update",
      uuid: props.uuid,
      payload: {
        openItem: newValue,
      },
    });
  },
});

const props = defineProps({
  urlParams: {
    type: String,
    default: "default param",
  },
  docUUID: {
    type: String,
    default: "default param",
  },
  uuid: {
    type: String,
    default: "default param",
  },
});
function closeTabConfirmed(index) {
  const entries = JSON.parse(JSON.stringify(state.value.entries));
  let openItem = state.value.openItem;
  entries.splice(index, 1);
  // make sure that the new current tab is always right
  if (index < openItem) {
    openItem = openItem - 1;
  }
  if (index === openItem && openItem !== 0) {
    openItem = 0;
  }
  $store.dispatch({
    type: "widgets/update",
    uuid: props.uuid,
    payload: {
      ...state.value,
      entries,
      openItem,
    },
  });
  this.overlay = false;
}
function closeTab(index) {
  this.overlay = index;
  // TODO add confirm dialogue here, apparently overlay does not work atm in vuetify rc
  this.closeTabConfirmed(index);
}
onMounted(() => { });
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
});
</script>
<style lang="css" scoped>
.itemBoardTab:hover .tabHandler {
  display: block !important;
}

.tabTitle {
  max-width: 250px;
  padding: 0 20px;
}

.v-tabs {
  background-color: #9e9e9e;
}

.tabHandler {
  display: none !important;
  position: absolute !important;
  color: black;
  top: 0px !important;
  cursor: pointer;
  right: 0px;
}
</style>
