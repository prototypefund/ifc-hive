<template>
  <v-list-item
    data-test-container="template/items/userListItem"
    :data-test-container-uuid="'userListItem_' + props.uuid"
    class="ticketMemberMouseOver"
    prepend-avatar="https://cdn.vuetifyjs.com/images/john.png"
    :title="
      user._source.firstname +
      ' ' +
      user._source.lastname +
      ' aka ' +
      user._source.nickname
    "
    :subtitle="user._source.email"
  />
</template>

<script setup>
import { inject, ref, onMounted, onUnmounted } from "vue";
const $store = inject("$store");

const props = defineProps({
  uuid: {
    type: String,
    required: true,
  },
  docUUID: {
    type: String,
    required: true,
  },
  props: {
    type: Object,
    default: {},
  },
});
const user = ref({});
const dataItemSubscriber$ = $store
  .select((state) => state.data[props.docUUID])
  .subscribe((val) => {
    user.value = val;
  });
onMounted(() => {});
onUnmounted(() => {
  dataItemSubscriber$.unsubscribe();
});
</script>
<style lang="css" scoped></style>
