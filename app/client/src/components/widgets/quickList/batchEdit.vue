<template>
    <v-card flat v-if="state.length > 0 && allLookup.data[state[0].uuid]" data-test-container="widgets/quickList/batchEdit"
        :data-test-container-uuid="props.uuid">
        <v-card-text>
            <v-row v-for="attribute in Object.keys(allLookup.data[state[0].uuid]._source)">
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

const $store = inject("$store");
const state = ref({});
const allLookup = $store.$data.get(props.actionId, "ALL");
const stateSubscriber$ = $store
    .select((state) => state.widgets[props.widgetUUID].entries)
    .subscribe((val) => {
        state.value = val;
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
    allLookup.value.unsubscribe();
});
</script>
