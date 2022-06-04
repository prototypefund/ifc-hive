<template>
    <v-container>
        <h1>{{ currState.name }} - {{ currState.title }}</h1>
        <p>url params {{ msg }}</p>
        {{ currState }}
    </v-container>
</template>
<script setup>
import { inject } from 'vue'
const $store = inject('$store')
console.dir(this)
const state = $store.select(state => state['app-dashboard']);
defineProps({
    msg: {
        type: String,
        default: 'moin'
    }
})
let currState
state.subscribe(val => currState = val)

</script>