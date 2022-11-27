<template>
  <a @click="handleQuickListItem" class="quickListHandler" data-test-container="widgets/quicklist/handler">
    <slot></slot>
  </a>
</template>
<script setup>
import { inject, onUnmounted, ref } from "vue";
import { propEq, findIndex } from 'ramda'
const $store = inject("$store");
const state = ref({});
const stateSubscriber$ = $store
  .select((state) => state.widgets[props.uuid])
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
  dataUUID: {
    // the uuid of the actual api data item
    type: String,
    default: false,
    required: true,
  },
  uuid: {
    // the uuid of the widget
    // TODO find out how to not always set this fix to "quickList"
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
  if (props.uuid && props.dataUUID) {
    // make sure that we only have on tab per display type and dataUUID
    let entryIndex = findIndex(propEq('uuid', props.dataUUID))(state.value.entries)
    // open the quicklist bar
    $store.dispatch({
      type: 'ui/update',
      payload: {
        currentTool: 'quickList'
      }
    });
    const entries = JSON.parse(JSON.stringify(state.value.entries))
    if (entryIndex > -1) {
      if (props.tabType != state.value.entries[entryIndex].type) {
        // if display types vary we may create a second tab for the same uuid
        debugger
      } else {
        entryIndex = state.value.entryIndex
      }

    } else {
      // create an object describing the view type and the uuid (of the data element) as well as possible query or display parameters
      entries.unshift({
        uuid: props.dataUUID,
        type: props.tabType,
        props: props.props,
      })
      // as we unshift new entries, the currently selected tab always needs to be 0
      entryIndex = 0
    }

    $store.dispatch({
      type: "widgets/update",
      uuid: props.uuid,
      payload: {
        entries,
        entryIndex
      },
    });

  }
};
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
});
</script>
<style lang="scss" scoped>
.quickListHandler {
  cursor: pointer;
}
</style>
