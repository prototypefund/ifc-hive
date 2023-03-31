<template>
  <a @click="removeFromQuicklist" class="quickListHandler" v-if="state && props.uuid"
    data-test-container="widgets/quickList/handler/click_remove" :data-test-container-uuid="props.uuid">
    <slot></slot>
  </a>
</template>
<script setup>
import { inject, onUnmounted, ref, shallowRef } from "vue";
import { propEq, findIndex } from "ramda";
const $store = inject("$store");
const state = ref({});
const currentTool = shallowRef(false);
const currentNavigationTool = shallowRef(false);
const stateSubscriber$ = $store
  .select((state) => state.widgets[props.uuid])
  .subscribe((val) => {
    state.value = val;
  });
const currentToolSubscriber$ = $store
  .select((state) => state.ui.currentNavigationTool)
  .subscribe((val) => {
    currentTool.value = val;
  });
const props = defineProps({
  docUUID: {
    // the uuid of the actual api data item
    type: String,
    default: false,
    required: true,
  },
  uuid: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    default: 'remove'
  }
});
const removeFromQuicklist = () => {
  if (props.uuid && props.docUUID) {
    if (props.action === 'remove_all') {
      $store.dispatch({
        type: "widgets/update",
        uuid: props.uuid,
        payload: {
          entries: [],
          openItem: 0,
        },
      });
      return true
    }
    // make sure that we only have on tab per display type and docUUID
    let openItem = findIndex(propEq("uuid", props.docUUID))(state.value.entries);
    const entries = JSON.parse(JSON.stringify(state.value.entries));
    if (openItem > -1) {
      // as we can have several modes in the quicklist items and different display Types per item, we will simply remove any quicklist entry of the current UUID and create a new one with the proper props from now
      entries.splice(openItem, 1);
    }
    openItem = 0;

    $store.dispatch({
      type: "widgets/update",
      uuid: props.uuid,
      payload: {
        entries,
        openItem,
      },
    });
  }
}

onUnmounted(() => {
  stateSubscriber$.unsubscribe();
  currentToolSubscriber$.unsubscribe();
});
</script>
<style lang="scss" scoped>
.quickListHandler {
  cursor: pointer;
}
</style>
