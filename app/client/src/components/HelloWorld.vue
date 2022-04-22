<script setup>
import { ref, onMounted, inject } from 'vue'

const $api = inject('$api')

onMounted(async () => {
    const res = await $api.get('/items', {
      headers: {
        'Accept-Version': '1.x'
      }
    })
    console.dir(res.data)
})

defineProps({
  msg: String
})

const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>
  <h1>Hallo Christian diggi</h1>

  <p>
    <a href="https://vitejs.dev/guide/features.html" target="_blank">
      IFC-Hive
    </a>
    |
    <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Documentation</a>
  </p>

  <button type="button" @click="count++">count is: {{ count }}</button>
  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
</template>

<style scoped>
a {
  color: #42b983;
}
</style>
