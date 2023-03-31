<template>
  <span>
    <v-icon
      v-if="socket.status == 1"
      icon="mdi-checkbox-marked-circle"
      color="success"
      size="small" />

    <v-icon
      v-else
      icon="mdi-alert-circle"
      color="error"
      size="small" />

  </span>
</template>
<script setup>
import { inject, ref, onMounted, onUnmounted } from "vue";

const $store = inject('$store')


const socket = ref({})

const socketStatus$ = $store
  .select((state) => state.socket)
  .subscribe((val) => {
    socket.value = val;
  });

onMounted(() => {
});
onUnmounted(() => {
  socketStatus$.unsubscribe()
});
</script>

<style lang="css" scoped></style>
