<template>
    <v-container>
        <h1>{{ msg || 'hmm' }}</h1>
    </v-container>
</template>
<script setup>
import { inject } from 'vue'
import {
    createFeatureSelector,
    createSelector
} from 'mini-rx-store';

const $store = inject('$store')


/*
const dashboardStore = {
    initialState: {
        msg: props.msg || "fallback"
    },
    reducers: {
        msg: (state, action) => {
            debugger;
        }
    }
}
*/
</script>