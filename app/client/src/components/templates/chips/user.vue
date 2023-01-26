<template>
  <v-row
    data-test-container="templates/chips/user"
    :data-test-container-uuid="props.uuid"
  >
    <v-col cols="auto" v-for="usr in props.selectedUser">
      <v-chip
        size="small"
        :color="user.data[usr] ? user.data[usr]._source.color || 'grey' : 'grey'"
        >{{ user.data[usr] ? user.data[usr]._title || usr : usr }}</v-chip
      >
    </v-col>
  </v-row>
</template>

<script setup>
import { inject, ref, onMounted, onUnmounted } from "vue";
const $store = inject("$store");

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
const user = ref($store.$data.get(props.actionId, "ALL_USER"));
onMounted(() => {});
onUnmounted(() => {
  user.unsubscribe();
});
</script>
