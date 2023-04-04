<template>
    <v-select v-if="project.lookup" v-model="currentProject"
        :label="project.lookup[project.id] ? project.lookup[project.id].shorttitle : 'bitte wählen'" :items="project.list"
        density="compact" class="projectSwitch">
    </v-select>
</template>
<script setup>
import { inject, ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from 'vue-router'
const $store = inject('$store')
const $eventbus = inject('$eventbus')
const project = ref({})
const router = useRouter()
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
        router.push({
            name: 'app.project.index',
            params: {
                id: newValue
            }
        })
        setTimeout(() => {
            $eventbus.emit("switchProject", newValue)
        }, 200);

    },
});


onMounted(() => {
});
onUnmounted(() => {
    projectStatus$.unsubscribe()
});
</script>

<style lang="css" scoped></style>
