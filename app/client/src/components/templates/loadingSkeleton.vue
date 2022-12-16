<template>
  <v-row align="center" justify="center" :style="{ height: height + 'px' }">
    <v-col cols="12" class="fill-height progressCenter">
      <div>
        <v-progress-circular indeterminate color="primary" />
      </div>
    </v-col>
  </v-row>
</template>
<script setup>
defineProps({
  height: {
    type: Number,
    default: 500,
  },
});
</script>
<style lang="css" scoped>
.progressCenter > div {
  margin: auto;
  width: 32px;
  padding: 10% 25% 10% 15% !important;
}
</style>
