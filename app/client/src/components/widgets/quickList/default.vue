<template>
  <v-card flat class="quickListWrapper" color="grey" v-if="state" data-test-container="widgets/quicklist/default">
    <v-tabs v-model="entryIndex" fixed-tabs v-if="state.entries.length > 0">
      <v-tab v-for="(item, index) in state.entries" :key="item" @click.middle="closeTab(index)" class="quickListTab">
        {{ item.type }} - {{ item.uuid }}
        <v-icon class="tabHandler" @click="closeTab(index)">mdi-close-octagon</v-icon>
      </v-tab>
    </v-tabs>
    <v-window v-model="entryIndex" class="tabScrollContainer">
      <v-window v-if="!state.entries || state.entries.length === 0">
        <no-results-yet />
      </v-window>
      <v-window-item v-else v-for="(item, index) in state.entries" :key="item">
        <Detail v-if="item.type === 'detail'" :props="item.props" uuid="quickList" :docUUID="item.uuid" />
      </v-window-item>
    </v-window>
  </v-card>
</template>
<script setup>
import { inject, ref, onMounted, onUnmounted, computed } from "vue";
import Detail from './types/detail.vue'
import noResultsYet from '@t/noResultsYet.vue'
const $store = inject("$store");
const state = ref({});

const stateSubscriber$ = $store
  .select((state) => state.widgets[props.uuid])
  .subscribe((val) => {
    state.value = val;
  });

const entryIndex = computed({
  // getter
  get() {
    return state.value.entryIndex || 0;
  },
  // setter
  set(newValue) {
    $store.dispatch({
      type: "widgets/update",
      uuid: props.uuid,
      payload: {
        entryIndex: newValue
      },
    });
  }
})

const props = defineProps({
  urlParams: {
    type: String,
    default: "default param",
  },
  dataUUID: {
    type: String,
    default: "default param",
  },
  uuid: {
    type: String,
    default: "default param",
  },
});
function closeTabConfirmed(index) {
  const entries = JSON.parse(JSON.stringify(state.value.entries))
  let entryIndex = state.value.entryIndex
  entries.splice(index, 1)
  // make sure that the new current tab is always right
  if (index < entryIndex) {
    entryIndex = entryIndex - 1
  }
  if ((index === entryIndex) && entryIndex !== 0) {
    entryIndex = 0
  }
  if (entries.length === 0) {
    $store.dispatch({
      type: 'ui/update',
      payload: {
        currentTool: false
      }
    });
  }
  $store.dispatch({
    type: "widgets/update",
    uuid: props.uuid,
    payload: {
      ...state.value, entries, entryIndex
    }
  });
  this.overlay = false;

}
function closeTab(index) {
  this.overlay = index;
  // TODO add confirm dialogue here, apparently overlay does not work atm in vuetify rc
  this.closeTabConfirmed(index);
}
onMounted(() => {

});
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
});

</script>
<style lang="css" scoped>
.quickListTab:hover .tabHandler {
  display: block !important;
}

.tabHandler {
  display: none !important;
  position: absolute !important;
  top: 10px !important;
  cursor: pointer;
  right: 0px;
}
</style>
