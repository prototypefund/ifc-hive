<template>
    <v-card flat v-if="state && state.length > 0 && rootItem" data-test-container="widgets/quickList/batchEdit"
        :data-test-container-uuid="props.uuid">
        <v-card-text>
            <v-row v-for="attribute in Object.keys(rootItem._source)">
                {{ attribute }}
            </v-row>
            <!--v-row>
              <v-col cols="12">
                <v-text-field v-model="title" :label="$t('generics.title')" variant="underlined"></v-text-field>
              </v-col>
              <v-col cols="12">
                <tag-combobox v-if="item._disId" :tag-lookup="tagLookup" :widgetUUID="props.widgetUUID" mode="edit"
                  :docUUID="item._id" />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="due" :label="$t('generics.dueDate')" variant="underlined"
                  v-if="vuetifyHasDatePicker == true"></v-text-field>
                <v-label>{{ $t("generics.dueDate") }}</v-label>
                <p v-if="due">{{ $filters.dateFormat(due) }}</p>
              </v-col>

              <v-col cols="12">
                <user-autocompletion v-if="item._disId" :user-lookup="userLookup" :widgetUUID="props.widgetUUID" mode="edit"
                  :docUUID="item._id" selectedUserRole="assigned" />
              </v-col>
              <v-col cols="12">
                <v-switch v-model="closed" hide-details
                  :label="closed ? $t('generics.closed') : $t('generics.open')"></v-switch>
              </v-col>
            </!--v-row-->
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
