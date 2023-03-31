<template>
  <v-card v-if="props" data-test-container="widgets/error/default">
    There was an error while loading your widget
    <pre>
    {{ props }}
    </pre>
  </v-card>
</template>
<script setup>
const props = defineProps({
  props: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  uuid: {
    type: String,
    required: true,
  },
});
</script>
