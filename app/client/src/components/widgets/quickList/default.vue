<template>
  <v-card flat class="quickListWrapper" color="grey" v-if="state" data-test-container="widgets/quicklist/default">
    <v-tabs v-model="entryIndex" fixed-tabs v-if="state.entries.length > 0">
      <v-tab v-for="(item, index) in state.entries" :key="item" @click.middle="closeTab(index)" class="quickListTab">
        {{ item.type }} - {{ item.uuid }}
        <v-icon class="tabHandler" @click="closeTab(index)">mdi-close-octagon</v-icon>
      </v-tab>
    </v-tabs>
    <v-window v-model="entryIndex" class="tabScrollContainer">
      <v-window-item v-for="(item, index) in state.entries" :key="item">
        <Detail v-if="item.type === 'detail'" :props="item.props" uuid="quickList" :docUUID="item.uuid" />
      </v-window-item>
    </v-window>
  </v-card>
</template>
<script setup>
import { inject, ref, onMounted, onUnmounted, computed } from "vue";
import Detail from './types/detail.vue'
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

onMounted(() => {

});
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
});
function closeTabConfirmed(index) {
  debugger
  this.overlay = false;

}
function closeTab(index) {
  this.overlay = index;
  // TODO add confirm dialogue here, apparently overlay does not work atm in vuetify rc
  this.closeTabConfirmed(index);
}
function handleQuicklist(val) {
  this.$store.dispatch({
    type: "ui/update",
    payload: {
      currentTool: val,
    },
  });
}
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
