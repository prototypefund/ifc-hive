<template>
  <a @click="handleQuickListItem" class="quickListHandler" v-if="state && props.uuid"
    data-test-container="widgets/quickList/handler/click" :data-test-container-uuid="props.uuid">
    <slot></slot>
  </a>
</template>
<script setup>
import { inject, onUnmounted, ref, shallowRef } from "vue";
import { propEq, findIndex } from "ramda";
const $store = inject("$store");
const state = ref({});
const currentTool = shallowRef(false);
const stateSubscriber$ = $store
  .select((state) => state.widgets[props.uuid])
  .subscribe((val) => {
    state.value = val;
  });
const currentToolSubscriber$ = $store
  .select((state) => state.ui.currentTool)
  .subscribe((val) => {
    currentTool.value = val;
  });
const props = defineProps({
  tabType: {
    // tabtype like list, detail, edit, and stuff I don't know yet
    type: String,
    default: "list",
    required: true,
  },
  dataTitle: {
    // tabtype like list, detail, edit, and stuff I don't know yet
    type: String,
    required: true,
  },
  template: {
    // the location under components/widgets from where to get a file to be shown for the item in quicklist
    type: String,
    required: false,
  },
  action: {
    // add, delete, clear for elements in quicklist
    type: String,
    default: "add",
    required: true,
  },
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
  props: {
    // whatever props we want to use for the tab
    type: Object,
    default: () => ({}),
  },
});
const handleQuickListItem = () => {
  if (props.uuid && props.docUUID) {
    // make sure that we only have on tab per display type and docUUID
    let openItem = findIndex(propEq("uuid", props.docUUID))(state.value.entries);
    // open the quicklist bar
    if (currentTool.value !== "quickList") {
      $store.dispatch({
        type: "ui/update",
        payload: {
          currentTool: "quickList",
        },
      });
    }

    const entries = JSON.parse(JSON.stringify(state.value.entries));
    if (openItem > -1) {
      // as we can have several modes in the quicklist items and different display Types per item, we will simply remove any quicklist entry of the current UUID and create a new one with the proper props from now
      entries.splice(openItem, 1);
    }
    entries.unshift({
      uuid: props.docUUID,
      type: props.tabType,
      template: props.template || false,
      title: props.dataTitle,
      props: props.props,
    });
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
};
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
