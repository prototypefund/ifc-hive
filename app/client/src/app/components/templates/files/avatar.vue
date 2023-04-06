<template>
    <div data-test-container="templates/files/avatar" :data-test-container-uuid="props.uuid">
        <v-avatar start color="indigo" size="100">
            <v-img v-if="item" :src="item.file" />
            <span justify="space-around" v-else></span>
        </v-avatar>
        <component v-if="uploader.component && props.mode === 'edit'" :is="uploader.component" :uuid="uploader.uuid" />
    </div>
</template>

<script setup>
import {
    inject,
    ref,
    shallowRef,
    onMounted,
    defineAsyncComponent,
    onUnmounted,
} from "vue";
import { widgetLoader } from "@lib/widgetLoader";
import { getSource } from "@lib/dataHelper.js";
const $store = inject("$store");

const props = defineProps({
    uuid: {
        type: String,
        default(rawProps) {
            return rawProps.widgetUUID + "_files_avatar_" + rawProps.docUUID;
        },
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    widgetUUID: {
        type: String,
        required: true,
    },
    mode: {
        type: String,
        default: "view",
    },
    docUUID: {
        type: String,
        required: true,
    },
    props: {
        type: Object,
        default: {},
    },
});
// get the document we want to show and edit the tags for. This will be reactive
const item = ref(false);
const dataItemSubscriber$ = $store
    .select((state) => state.data[props.docUUID]._source.avatar)
    .subscribe((val) => {
        const fullDocument = {
            ...val,
            _source: getSource(val._id)
        }
        item.value = fullDocument._source.avatar || {};
    });

const uploader = shallowRef(false);
onMounted(() => {
    // if we are in edit mode, we want to have a uppy upload widget in our avatar widget
    if (props.mode === "edit") {
        //create a basic widget conf object for our uploader widget
        uploader.value = {
            uuid: props.uuid + "_fileUploader",
            name: "fileUploader",
            face: "overlay",
            props: {
                optionsDashboard: {
                    showProgressDetails: false,
                    height: 80,
                },
            },
        };
        // create the store state for our uppy widget
        $store.dispatch({
            type: "widgets/add",
            payload: [uploader.value],
        });

        uploader.value.component = defineAsyncComponent(() => {
            return widgetLoader(uploader.value.name, uploader.value.face);
        });
    }
});
onUnmounted(() => {
    dataItemSubscriber$.unsubscribe();
});
</script>
