<template>
    <v-container v-if="currState">
        <h1>{{ currState.name }} - {{ currState.title }}</h1>
        <p>url params {{ msg }}</p>
        {{ currState }}
    </v-container>
</template>
<script setup>
import { inject } from 'vue'
const $store = inject('$store')
const state = $store.select(state => state['app-dashboard']);
let currState
state.subscribe(val => currState = val)
defineProps({
    msg: {
        type: String,
        default: 'moin'
    }
})

</script>