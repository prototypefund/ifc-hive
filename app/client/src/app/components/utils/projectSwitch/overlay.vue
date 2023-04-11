<template>
    <v-overlay v-if="project.lookup && project.id" v-model="overlayOpen" class="align-center justify-center">
        <template #activator="{ isActive, props }">
            <v-btn v-bind="props"> {{ project.lookup[project.id].code }}</v-btn>
        </template>
        <v-card>
            <v-list lines="one">
                <v-list-item v-for="uuid in project.list" v-if="uuid !== project.id" :key="uuid"
                    @click="switchProject(uuid)" :title="project.lookup[uuid].title"
                    :subtitle="project.lookup[uuid].description"></v-list-item>
            </v-list>
        </v-card>
    </v-overlay>
</template>
<script setup>
import { inject, ref, shallowRef, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from 'vue-router'
const $store = inject('$store')
const $eventbus = inject('$eventbus')
const project = ref({})
const router = useRouter()
const overlayOpen = shallowRef(false)
const projectStatus$ = $store
    .select((state) => state.project)
    .subscribe((val) => {
        project.value = val;
    });

const switchProject = (uuid) => {
    router.push({
        name: 'app.project.index',
        params: {
            projectId: uuid
        }
    })
    setTimeout(() => {
        $eventbus.emit("switchProject", uuid)
        overlayOpen.value = false
    }, 200);
}

onMounted(() => {
});
onUnmounted(() => {
    projectStatus$.unsubscribe()
});
</script>

<style lang="css" scoped></style>
