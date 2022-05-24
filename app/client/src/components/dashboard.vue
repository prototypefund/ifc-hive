<template>
    <v-container>
        <h1>{{ msg || 'hmm' }}</h1>

    </v-container>
</template>
<script setup>
import { inject } from 'vue'
const $store = inject('$store')
const msgState = $store.select(state => state['dashboard'].msg);
defineProps({
    msg: {
        type: String,
        default: 'moin'
    }
})
console.dir(msgState)

</script>