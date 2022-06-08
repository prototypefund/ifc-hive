<template>
    <v-container v-if="currState">
        <h1>{{ $t(currState.routeName) }} - {{ currState.title }}</h1>
        <p>url params > {{ urlParams }} &lt;</p>
        <pre> {{ currState }}</pre>

    </v-container>
</template>
<script setup>
import { inject } from 'vue'
const $store = inject('$store')
const state = $store.select(state => state['app-dashboard']);
let currState
state.subscribe(val => currState = val)
defineProps({
    urlParams: {
        type: String,
        default: 'moin'
    }
})

</script>