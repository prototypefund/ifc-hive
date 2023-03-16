<template>
    <v-select v-model="currentProject" :label="project.lookup[project.id] || 'bitte wählen'" :items="project.list"
        density="compact" class="projectSwitch">
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
