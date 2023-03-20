<template>
  <v-card flat class="itemBoardWrapper" v-if="state" data-test-container="widgets/itemBoard/default"
    :data-test-container-uuid="props.uuid">
    moin
  </v-card>
</template>
<script setup>
import { inject, ref, onMounted, onUnmounted, computed, defineAsyncComponent } from "vue";

const $store = inject("$store");
const state = ref({});

const stateSubscriber$ = $store
  .select((state) => state.widgets[props.uuid])
  .subscribe((val) => {
    state.value = val;
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
