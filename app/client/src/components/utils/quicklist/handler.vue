<template>
  <a @click="handleQuickListItem">
    <slot></slot>
  </a>
</template>
<script setup>
import { inject, onUnmounted, ref } from "vue";
const $store = inject("$store");
const state = ref({});
const stateSubscriber$ = $store
  .select((state) => state.quickList)
  .subscribe((val) => {
    state.value = val;
  });
const props = defineProps({
  tabType: {
    // tabtype like list, detail, edit, and stuff I don't know yet
    type: String,
    default: "list",
    required: true,
  },
  action: {
    // add, delete, clear
    type: String,
    default: "add",
    required: true,
  },
  uuid: {
    // the uuid of the actual api data item
    type: String,
    default: false,
    required: true,
  },
  props: {
    // whatever props we want to use for the tab
    type: Object,
    default: () => ({}),
  },
});
const handleQuickListItem = () => {
  if (props.uuid) {
    switch (props.action) {
      case "add":
        $store.dispatch({
          type: "quickList/add",
          payload: {
            uuid: props.uuid,
            tabType: props.tabType,
            props: props.props,
          },
        });
        break;
    }
  }
};
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
});
</script>
