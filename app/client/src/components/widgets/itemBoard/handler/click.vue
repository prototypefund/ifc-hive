<template>
  <a @click="handleitemBoardItem" class="itemBoardHandler" v-if="state && props.uuid"
    data-test-container="widgets/itemBoard/handler/click" :data-test-container-uuid="props.uuid">
    <slot></slot>
  </a>
</template>
<script setup>
import { inject, onUnmounted, ref, shallowRef } from "vue";
import { propEq, findIndex } from "ramda";
const $store = inject("$store");
const state = ref({});
const stateSubscriber$ = $store
  .select((state) => state.widgets[props.uuid])
  .subscribe((val) => {
    state.value = val;
  });
const props = defineProps({
  type: {
    // type like  detail, memo, tags, user, batch, and stuff I don't know yet
    type: String,
    default: "list",
    required: true,
  },
  dataTitle: {
    // the title for the entry we display in the itemBoard
    type: String,
    required: true,
  },
  template: {
    // the location under components/widgets from where to get a file to be shown for the item in itemBoard
    type: String,
    required: false,
  },
  action: {
    // add, delete, clear for elements in itemBoard
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
const handleitemBoardItem = () => {
  if (props.uuid && props.docUUID) {
    // make sure that we only have on tab per display type and docUUID
    let openItem = findIndex(propEq("uuid", props.docUUID))(state.value.entries);


    const entries = JSON.parse(JSON.stringify(state.value.entries));
    if (openItem > -1) {
      // as we can have several modes in the itemBoard items and different display Types per item, we will simply remove any itemBoard entry of the current UUID and create a new one with the proper props from now
      entries.splice(openItem, 1);
    }
    entries.unshift({
      uuid: props.docUUID,
      type: props.type,
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
});
</script>
<style lang="scss" scoped>
.itemBoardHandler {
  cursor: pointer;
}
</style>
