<template>
  <v-chip v-if="user" size="small" :color="user ? user._source.color || 'grey' : 'grey'"
    data-test-container="templates/chip/user" :data-test-container-uuid="props.uuid">
    <QuickListHandler uuid="quickList" :docUUID="user._id" :dataTitle="user._title" :type="user._type">
      <v-avatar start color="indigo">
        <v-img v-if="user._source.avatar" :src="user._source.avatar.file" />
        <span justify="space-around" v-else>{{ user._source.firstname.substring(0, 1) }}
          {{ user._source.lastname.substring(0, 1) }}</span>
      </v-avatar>
      {{ user._title }}
    </QuickListHandler>
  </v-chip>
</template>

<script setup>
import { inject, ref, onMounted, onUnmounted } from "vue";
import QuickListHandler from "@w/quickList/handler/click.vue";
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
onMounted(() => { });
onUnmounted(() => {
  dataItemSubscriber$.unsubscribe();
});
</script>
<style lang="css" scoped></style>
