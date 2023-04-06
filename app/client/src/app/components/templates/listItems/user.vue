<template>
  <v-list-item v-if="user._source" data-test-container="template/listItems/user" :data-test-container-uuid="props.uuid"
    class="ticketMemberMouseOver">
    <template v-slot:prepend>
      <v-avatar start color="indigo">
        <v-img v-if="user._source.avatar && user._source.avatar.file" :src="user._source.avatar.file" />
        <span justify="space-around" v-else>{{ user._source.firstname.substring(0, 1) }}
          {{ user._source.lastname.substring(0, 1) }}</span>
      </v-avatar>
    </template>
    <v-list-item-title>
      {{ user._source.firstname }} {{ user._source.lastname }} aka
      {{ user._source.nickname }}
    </v-list-item-title>
    <v-list-item-subtitle>
      {{ user._source.email }}
    </v-list-item-subtitle>
  </v-list-item>
</template>

<script setup>
import { inject, ref, onMounted, onUnmounted } from "vue";
import { getSource } from "@lib/dataHelper.js";
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
    const fullDocument = {
      ...val,
      _source: getSource(val._id)
    }
    if (user.value !== fullDocument) {
      user.value = fullDocument || {};
    }
  });
onMounted(() => { });
onUnmounted(() => {
  dataItemSubscriber$.unsubscribe();
});
</script>
<style lang="css" scoped></style>
