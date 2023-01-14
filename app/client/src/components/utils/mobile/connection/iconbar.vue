<template>
  <div class="d-flex justify-space-around">
    <v-icon color="grey" xsmall>mdi-check-network</v-icon>
    <Camera v-if="$mobile" />
    <v-icon color="grey" xsmall v-if="networkState.connectionType === 'wifi'"
      >mdi-wifi</v-icon
    >
    <v-icon color="grey" xsmall v-else-if="networkState.connectionType === 'cellular'"
      >mdi-signal-cellular-3
    </v-icon>
    <v-icon color="grey" xsmall v-else>mdi-wifi-off</v-icon>
  </div>
</template>
<script setup>
import { inject, ref, onMounted, onUnmounted, defineAsyncComponent } from "vue";
const $mobile = inject("$mobile");
const networkState = ref({ connectionType: "none" });
const Camera = defineAsyncComponent(() => import("../camera/icon.vue"));
const getStatus = async () => {
  networkState.value = await $mobile.Network.getStatus();
};
const subscribeStatus = () => {
  $mobile.Network.addListener("networkStatusChange", (status) => {
    networkState.value = status;
  });
};
const unSubscribeStatus = () => {
  $mobile.Network.removeListener("networkStatusChange");
};
onMounted(() => {
  if ($mobile) {
    subscribeStatus();
    getStatus();
  }
});
onUnmounted(() => {
  if ($mobile) {
    unSubscribeStatus();
  }
});
</script>

<style lang="css" scoped></style>
