<template>
    <v-select v-model="currentProject" :label="project.id || 'bitte wählen'" :items="project.list" density="compact"
        class="projectSwitch">
    </v-select>
</template>
<script setup>
import { inject, ref, computed, onMounted, onUnmounted } from "vue";

const $store = inject('$store')
const $eventbus = inject('$eventbus')
let data = false
const getDataItems = (list) => {
    if (data) {
        data.value.unsubscribe()
        data = false
    }
    const identifier = []
    list.forEach((uuid) => {
        identifier.push('_id:' + uuid)
    })
    data = $store.$data.get("MY_PROJECTS", "ALL_PROJECTS", {
        identifier
    });
}
const project = ref({})

const projectStatus$ = $store
    .select((state) => state.project)
    .subscribe((val) => {
        if (project.value.list !== val.list) {
            getDataItems(val.list)
        }
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
