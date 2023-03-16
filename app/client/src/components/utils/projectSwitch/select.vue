<template>
    <v-select v-model="currentProject"
        :label="project.lookup[project.id] ? project.lookup[project.id].shorttitle : 'bitte wählen'" :items="project.list"
        density="compact" class="projectSwitch">
    </v-select>
</template>
<script setup>
import { inject, ref, computed, onMounted, onUnmounted } from "vue";

const $store = inject('$store')
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
        $store.dispatch({
            type: "project/setId",
            payload: newValue,
        });
    },
});


onMounted(() => {
});
onUnmounted(() => {
    projectStatus$.unsubscribe()
});
</script>

<style lang="css" scoped></style>
