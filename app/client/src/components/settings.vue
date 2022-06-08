<template>
    <v-container v-if="currState">
        <h1>Settings Page</h1>
    </v-container>
</template>
<script setup>
import { inject } from 'vue'
const $store = inject('$store')
const state = $store.select(state => state['app-settings']);
let currState
state.subscribe(val => currState = val)
defineProps({

})

</script>