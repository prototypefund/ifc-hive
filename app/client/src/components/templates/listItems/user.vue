<template>
  <v-list-item
    data-test-container="template/listItems/user"
    :data-test-container-uuid="props.uuid"
    class="ticketMemberMouseOver"
    prepend-avatar="https://cdn.vuetifyjs.com/images/john.png"
  >
    <v-list-item-title>
      <QuickListHandler
        uuid="quickList"
        :docUUID="user._id"
        :dataTitle="user._title"
        :tab-type="user._type"
        action="add"
      >
        {{ user._source.firstname }} {{ user._source.lastname }} aka
        {{ user._source.nickname }}
      </QuickListHandler>
    </v-list-item-title>
    <v-list-item-subtitle>
      {{ user._source.email }}
    </v-list-item-subtitle>
  </v-list-item>
</template>

<script setup>
import { inject, ref, onMounted, onUnmounted } from "vue";
import QuickListHandler from "@w/quickList/handler.vue";
const $store = inject("$store");

const props = defineProps({
  uuid: {
    type: String,
    default(rawProps) {
      return rawProps.widgetUUID + "_listItems_user_" + rawProps.docUUID;
    },
  },
  widgetUUID: {
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
