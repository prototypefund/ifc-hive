<template>
    <v-container>
        <h1>{{ msg }}</h1>
        <h2>{{ msg1 }}</h2>
    </v-container>
</template>
<script setup>
import { inject } from 'vue'

const $store = inject('$store')
console.dir($store)
defineProps({
    msg: {
        type: String,
        default: 'moin'
    },
    msg1: {
        type: String,
        default: () => { return 'moin' }
    },

})
</script>