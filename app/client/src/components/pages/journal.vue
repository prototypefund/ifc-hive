<template>
  <v-container fluid class="pa-0">

    <v-toolbar color="transparent" flat>
      <v-spacer />
      <v-toolbar-items>
        <v-btn text color="primary">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <Grid :contents="state.slots" class="mt-5"></Grid>
    </v-container>

</template>

<script setup>
import { inject, shallowRef, onMounted, onUnmounted, defineAsyncComponent } from 'vue'
const $store = inject('$store')
const state = shallowRef({})
const Grid = shallowRef()

const stateSubscriber = $store.select(state => state.currentPage).subscribe(val => {
    state.value = val
})

const gridSubscriber = $store.select(state => state.currentPage.grid).subscribe(val => {
    if (val) {
        Grid.value = defineAsyncComponent((props) => {
            //TODO find out why vite alias dont work. Add try catch here
            return import(`../templates/grids/${val}.vue`)
        })
    }
})

const props = defineProps({
    urlParams: {
        type: String,
        default: 'default param'
    }
})

onMounted(() => {
    $store.dispatch({
        type: 'currentPage/update',
        payload: {
            loading: false
        }
    });
})
onUnmounted(() => {
    stateSubscriber.unsubscribe()
    gridSubscriber.unsubscribe()
    $store.dispatch({
        type: 'currentPage/update',
        payload: {
            loading: true
        }
    });
})
</script>

