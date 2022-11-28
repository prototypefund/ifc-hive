<template>
    <v-timeline v-if="state && props.uuid" data-test-container="widgets/journal/add/default"
        :data-test-container-uuid=props.uuid>
        <v-card dot-color="red-lighten-1" fill-dot size="x-small">
            <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field data-test-id="firstname" v-model="state.data.firstname"
                    :rules="state.definitions.firstname" :counter="10" label="firstname" required>
                </v-text-field>
                <v-text-field data-test-id="name" :rules="state.definitions.name" v-model="state.data.name"
                    :counter="10" label="Name" required>
                </v-text-field>
                <v-text-field data-test-id="email" :rules="state.definitions.email" v-model="state.data.email"
                    label="E-mail" required>
                </v-text-field>
            </v-form>
        </v-card>
    </v-timeline>
</template>
<script setup>
import { inject, ref, onMounted, onUnmounted } from "vue";
const $store = inject("$store");
const state = ref({
    data: {
        email: "lutz@maier.de",
        name: "meier test 12",
        firstname: "lutz hallo",
    },
    definitions: {
        email: [
            v => !!v || 'E-mail is required',
            v => /.+@.+/.test(v) || 'E-mail must be valid',
        ],
        name: [
            v => !!v || 'Name is required',
            v => v.length <= 10 || 'Name must be less than 10 characters',
        ],
        firstname: [
            v => !!v || 'Name is required',
            v => v.length <= 20 || 'Name must be less than 10 characters',
        ],
    }
});

const props = defineProps({
    props: {
        type: Object,
    },
    uuid: {
        type: String,
    },
});

onMounted(() => { });
onUnmounted(() => {

});
</script>
