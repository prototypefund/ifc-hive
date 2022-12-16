<template>
  <v-app-bar
    density="compact"
    flat
    color="grey-lighten-2"
    class="toolBar"
    data-test-container="templates/loadingSkeletonBar"
  >
    <v-progress-linear class="loader" indeterminate color="primary"></v-progress-linear>
  </v-app-bar>
</template>
<script setup>
defineProps({
  height: {
    type: Number,
    default: 500,
  },
});
</script>
<style scoped>
.loader {
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>
