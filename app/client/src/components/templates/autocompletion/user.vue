<template>
  <div data-test-container="templates/autocompletion/user" :data-test-container-uuid="props.uuid">
    <v-autocomplete :disabled="disabled" class="user_autocomplete" v-model="selectedUser"
      :items="Object.values(user.data)" chips item-title="_title" item-value="_id" hide-seleted closable-chips
      color="blue-grey-lighten-2" :label="$t('generics.' + selectedUserRole)" />
  </div>
</template>

<script setup>
import { inject, ref, onMounted, computed, onUnmounted } from "vue";
const $store = inject("$store");

const props = defineProps({
  uuid: {
    type: String,
    default(rawProps) {
      return rawProps.widgetUUID + "_autocompletion_user_" + rawProps.docUUID;
    },
  },
  widgetUUID: {
    type: String,
    required: true,
  },
  selectedUserRole: {
    type: String,
    required: true,
    default: "owner",
  },
  docUUID: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  actionId: {
    type: String,
    default(rawProps) {
      return rawProps.uuid + "_allUsers";
    },
  },
  props: {
    type: Object,
    default: {},
  },
});
// get all tags from the store, we do use the the "data" here, which is a plain clone of the tags objects. They are not reactive!
const user = ref($store.$data.get(props.actionId, "ALL_USER"));
// get the document we want to show and edit the tags for. This will be reactive
const item = ref(false);
const dataItemSubscriber$ = $store
  .select((state) => state.data[props.docUUID])
  .subscribe((val) => {
    if (item.value !== val) {
      item.value = val || {};
    }
  });
const selectedUser = computed({
  get() {
    return item.value._source ? item.value._source[props.selectedUserRole] || "" : "";
  },
  set(newValue) {
    const updateObj = {};
    updateObj[props.selectedUserRole] = newValue;
    $store.dispatch({
      type: "data/update",
      docUUID: props.docUUID || false,
      payload: updateObj,
    });
  },
});
onMounted(() => { });
onUnmounted(() => {
  user.unsubscribe();
  dataItemSubscriber$.unsubscribe();
});
</script>
<style lang="css">
.user_autocomplete input {
  text-indent: -9999px !important;
}
</style>
