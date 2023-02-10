<template>
    <div data-test-container="templates/files/avatar" :data-test-container-uuid="props.uuid">
        <v-avatar start color="indigo" size="250">
            <v-img v-if="item" :src="item.file" />
            <span justify="space-around" v-else></span>
        </v-avatar>
        <component v-if="uploader.component && mode === 'edit'" :is="uploader.component" :uuid="uploader.uuid">
        </component>
    </div>
</template>

<script setup>
import { inject, ref, onMounted, defineAsyncComponent, onUnmounted } from "vue";
import { widgetLoader } from "@lib/widgetLoader";
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
        item.value = val || {};
    });

const uploader = ref(false);
onMounted(() => {
    // if we are in edit mode, we want to have a uppy upload widget in our avatar widget
    if (props.mode === "edit") {
        //create a basic widget conf object for our uploader widget
        uploader.value = {
            uuid: props.uuid + "_fileUploader",
            name: "fileUploader",
            face: "default",
            props: {
                showProgressDetails: false,
                height: 40,
            },
        };
        // create the store state for our uppy widget
        $store.dispatch({
            type: "widgets/add",
            payload: [
                {
                    uuid: uploader.value.uuid,
                    name: uploader.value.name,
                    face: uploader.value.face,
                    props: uploader.value.props,
                },
            ],
        });

        uploader.value.component = defineAsyncComponent(() => {
            return widgetLoader(uploader.value.name, uploader.value.face);
        });
    }
});
onUnmounted(() => {
    dataItemSubscriber$.unsubscribe();
    if (uploader.value) {
        // remove our widget store if we had an uploade once
        $store.dispatch({
            type: "widgets/remove",
            payload: [uploader.value.uuid],
        });
    }
});
</script>
