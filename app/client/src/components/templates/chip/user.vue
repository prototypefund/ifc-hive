<template>
  <v-chip
    v-if="user"
    size="small"
    :color="user ? user._source.color || 'grey' : 'grey'"
    data-test-container="templates/chip/user"
    :data-test-container-uuid="props.uuid"
  >
    <QuickListHandler
      uuid="quickList"
      :docUUID="user._id"
      :dataTitle="user._title"
      :tab-type="user._type"
      action="add"
    >
      <v-avatar start>
        <v-img src="https://cdn.vuetifyjs.com/images/john.png"></v-img>
      </v-avatar>
      {{ user._title }}
    </QuickListHandler>
  </v-chip>
</template>

<script setup>
import { inject, ref, onMounted, onUnmounted } from "vue";
import QuickListHandler from "@w/quickList/handler.vue";
const $store = inject("$store");
const user = ref(false);

const props = defineProps({
  uuid: {
    type: String,
    default(rawProps) {
      return rawProps.widgetUUID + "_chip_user_" + rawProps.docUUID;
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
