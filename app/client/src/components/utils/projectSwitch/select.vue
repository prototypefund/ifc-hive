<template>
    <v-select v-model="currentProject" :label="currentProject" :items="project.list" label="Compact" density="compact">
        <template v-slot: prepend-inner-icon>
            <router-link :to="{ path: '/' }" id="breadcrumb-home">
                <v-icon icon="mdi-home" color="primary" />
            </router-link>
        </template>

    </v-select>
</template>
<script setup>
import { inject, ref, computed, onMounted, onUnmounted } from "vue";

const $store = inject('$store')
const $eventbus = inject('$eventbus')


const project = ref({})
const projectStatus$ = $store
    .select((state) => state.project)
    .subscribe((val) => {
        project.value = val;
    });
const currentProject = computed({
    // getter
    get() {
        return project.id;
    },
    // setter
    set(newValue) {
        if (project.id && newValue) {
            $eventbus.emit('socketLeaveRoom', project.id)
        }
        $store.dispatch({
            type: "project/setId",
            payload: newValue,
        });
        if (newValue) {
            $eventbus.emit('socketJoinRoom', newValue)
        }
    },
});
onMounted(() => {
});
onUnmounted(() => {
    projectStatus$.unsubscribe()
});
</script>

<style lang="css" scoped></style>
