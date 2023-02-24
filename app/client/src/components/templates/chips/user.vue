<template>
  <v-row data-test-container="templates/chips/user" :data-test-container-uuid="props.uuid">
    <v-col cols="auto" v-for="usr in props.selectedUser">
      <v-chip v-if="usr" size="small" :color="
        userLookup.data[usr] ? userLookup.data[usr]._source.color || 'grey' : 'grey'
      ">
        <v-avatar start color="indigo">
          <v-img v-if="userLookup.data[usr]._source.avatar" :src="userLookup.data[usr]._source.avatar.file" />
          <span justify="space-around" v-else>{{ userLookup.data[usr]._source.firstname.substring(0, 1) }}
            {{ userLookup.data[usr]._source.lastname.substring(0, 1) }}</span>
        </v-avatar>
        {{ userLookup.data[usr] ? userLookup.data[usr]._title || usr : usr }}
      </v-chip>
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
  userLookup: {
    type: Object,
    required: false,
  },
});
const userLookup = props.userLookup
  ? props.userLookup
  : $store.$data.get(props.actionId, "ALL_USER");
onMounted(() => { });
onUnmounted(() => {
  // if .value is set, it means that our lookup came from our store $date.get
  if (userLookup.value) {
    userLookup.value.unsubscribe();
  }
});
</script>
