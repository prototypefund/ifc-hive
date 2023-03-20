<template>
    <itemBoardHandler uuid="itemBoard" :docUUID="memo._source.owner" :dataTitle="dings" type="user" action="add">
        dings
    </itemBoardHandler>
    <br />
</template>
<script setup>
import { inject, ref, onMounted, onUnmounted } from "vue";
import itemBoardHandler from "@w/itemBoard/handler/batch.vue";

const $store = inject('$store')


const project = ref({})

const projectSubscriber$ = $store
    .select((state) => state.project)
    .subscribe((val) => {
        project.value = val;
    });

onMounted(() => {
});
onUnmounted(() => {
    projectSubscriber$.unsubscribe()
});
</script>

<style lang="css" scoped></style>
