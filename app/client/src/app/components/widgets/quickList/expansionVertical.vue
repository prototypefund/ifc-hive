<template>
  <v-card flat class="quickListWrapper" v-if="state" data-test-container="widgets/quicklist/expansionVertical"
    :data-test-container-uuid="props.uuid">
    <!--v-card-actions>
      <v-btn size="x-small" :append-icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'" @click="show = !show">
        Batch edit
      </v-btn>
    </!--v-card-actions>
    <v-expand-transition-->
    <!--div v-show="show">
      <v-divider />
      <v-card-text>
        <batch-edit :widgetUUID="props.uuid" />
      </v-card-text>
      <v-divider />
    </!--div>
    </v-expand-transition-->
    <QuickListHandler :uuid="props.uuid" :docUUID="props.docUUID" action="remove_all" v-if="state.entries.length > 1">
      <v-icon icon="mdi-close-box-multiple" color="error" />
    </QuickListHandler>
    <v-expansion-panels v-model="openItem" variant="popout" class="my-4" v-if="state.entries && state.entries.length > 0">
      <v-expansion-panel v-for="(item, index) in state.entries" :key="index">
        <v-expansion-panel-title>
          <template v-slot:default="{ expanded }">
            {{ item.type }} - {{ item.title }}
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text class="expandContent">
          <component v-if="component" :props="item.props" :widgetUUID="props.uuid" :docUUID="item.uuid" />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <no-results-yet v-else />
  </v-card>
</template>
<script setup>
import { inject, ref, shallowRef, onMounted, onUnmounted, computed, defineAsyncComponent } from "vue";
import noResultsYet from "@t/noResultsYet.vue";
import batchEdit from "./batchEdit.vue"
import QuickListHandler from "@w/quickList/handler/click_remove.vue";
const $store = inject("$store");
const state = ref({});
const show = shallowRef(false);

const stateSubscriber$ = $store
  .select((state) => state.widgets[props.uuid])
  .subscribe((val) => {
    state.value = val;
  });
const component = computed(() => {
  const currState = state.value;
  let component = "";
  if (currState.openItem === undefined) {
    return false
  }
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
    //return Array.isArray(state.value.openItem) ? state.value.openItem : [state.value.openItem];
    return state.value.openItem
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
    required: true
  }
});
function removeEntry(index) {
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
  if (entries.length === 0) {
    $store.dispatch({
      type: "ui/update",
      payload: {
        currentTool: false,
      },
    });
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
onMounted(() => { });
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
});
</script>
<style lang="css">
.quickListWrapper .quickListTab:hover .tabHandler {
  display: block !important;
}

.quickListWrapper .tabTitle {
  max-width: 250px;
  padding: 0 20px;
}

.quickListWrapper .v-tabs {
  background-color: #9e9e9e;
}

.quickListWrapper .tabHandler {
  display: none !important;
  position: absolute !important;
  color: black;
  top: 0px !important;
  cursor: pointer;
  right: 0px;
}

.quickListWrapper .expandContent>.v-expansion-panel-text__wrapper {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
</style>
