<template>
  <v-row data-test-container="templates/chips/user" :data-test-container-uuid="props.uuid">
    <v-col cols="auto" v-for="usr in props.selectedUser" :key="usr">
      <user-chip v-if="usr" :widgetUUID="props.widgetUUID" :docUUID="usr" />
    </v-col>
  </v-row>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import userChip from "@t/chip/user.vue";

const props = defineProps({
  uuid: {
    type: String,
    default(rawProps) {
      return rawProps.widgetUUID + "_chips_user_" + rawProps.docUUID;
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
  actionId: {
    type: String,
    default(rawProps) {
      return rawProps.uuid + "_allUser";
    },
  },
  selectedUser: {
    type: Array,
    required: true,
    default: [],
  },
  props: {
    type: Object,
    default: {},
  },
});
onMounted(() => { });
onUnmounted(() => {
});
</script>
