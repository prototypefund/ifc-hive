<template>
    <v-card flat v-if="state && state.length > 0 && rootItem" data-test-container="widgets/quickList/batchEdit"
        :data-test-container-uuid="props.uuid">
        <v-card-text>
            <v-row v-for="attribute in Object.keys(rootItem._source)">
                {{ attribute }}
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { inject, ref, onMounted, onUnmounted } from "vue";
import { getSource } from "@lib/dataHelper.js";

const $store = inject("$store");
const state = ref({});
const rootItem = ref(false);
const stateSubscriber$ = $store
    .select((state) => state.widgets[props.widgetUUID].entries)
    .subscribe((val) => {
        state.value = val;
    });
const dataItemSubscriber$ = $store
    .select((state) => state.data[state.value[0].uuid])
    .subscribe((val) => {
        debugger
        rootItem.value = val
        rootItem.value._source = getSource(val._id)

    });
const props = defineProps({
    widgetUUID: {
        type: String,
        required: true,
    },
    uuid: {
        type: String,
        default(rawProps) {
            return rawProps.widgetUUID + "_batchEdit";
        },
    },
    actionId: {
        type: String,
        default(rawProps) {
            return rawProps.uuid + "_ALL";
        },
    },

    props: {
        type: Object,
        default: {},
    },
});
onMounted(() => { });
onUnmounted(() => {
    stateSubscriber$.unsubscribe();
    dataItemSubscriber$.unsubscribe();
});
</script>
