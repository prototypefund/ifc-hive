<template>
    <div class="d-flex justify-space-around">
        <v-icon color="grey" xsmall>mdi-check-network</v-icon>
        <v-icon color="grey" xsmall v-if="networkState.connectionType === 'wifi'">mdi-wifi</v-icon>
        <v-icon color="grey" xsmall v-else-if="networkState.connectionType === 'cellular'">mdi-signal-cellular-3
        </v-icon>
        <v-icon color="grey" xsmall v-else>mdi-wifi-off</v-icon>
    </div>
</template>
<script setup>
import { inject, ref, onMounted, onUnmounted } from "vue";
const $mobile = inject("$mobile");
const networkState = ref({ connectionType: 'none' });
const getStatus = async () => {
    networkState.value = await $mobile.Network.getStatus();
}
const subscribeStatus = () => {
    $mobile.Network.addListener('networkStatusChange', status => {
        networkState.value = status
    });
}
onMounted(() => {
    if ($mobile) {
        subscribeStatus()
        getStatus()
    }
});
onUnmounted(() => {

});
</script>


<style lang="css">

</style>