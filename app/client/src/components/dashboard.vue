<template>
    <v-container>
        <h1>{{ msg || 'hmm' }}</h1>
    </v-container>
</template>
<script setup>
import { inject } from 'vue'
const $store = inject('$store')
console.dir($store)
</script>