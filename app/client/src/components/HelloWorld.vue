<script setup>
import { ref, onMounted, inject } from 'vue'

const $api = inject('$api')

onMounted(async () => { })

defineProps({
  msg: String
})

const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>

  <v-btn type="button" @click="count++" flat color="grey-lighten-2">
    count is: {{ count }}
  </v-btn>
</template>
