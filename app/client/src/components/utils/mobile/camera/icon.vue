<template>
    <span>
        <v-btn v-if="$mobile" flat icon="mdi-camera" @click="takePicture" />
        <v-dialog v-if="takenImage && takenImage.src" v-model="preview">
            <v-card>
                <v-img :src="takenImage.src" cover width="100%"></v-img>
                <v-card-title>
                    {{ takenImage.path }}
                </v-card-title>
                <v-card-subtitle>
                    {{ takenImage.webPath }}
                </v-card-subtitle>
                <v-card-actions>
                    <v-btn color="primary" @click="preview = false">Close</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'" @click="show = !show">More</v-btn>
                </v-card-actions>
                <v-expand-transition>
                    <div v-show="show">
                        <v-divider></v-divider>
                        <v-card-text>
                            {{ takenImage.raw }}
                        </v-card-text>
                    </div>
                </v-expand-transition>
            </v-card>
        </v-dialog>
    </span>
</template>
<script setup>
import { inject, ref, onMounted, onUnmounted, shallowRef } from "vue";
const $mobile = inject("$mobile");
const takenImage = ref({});
const preview = shallowRef(false)
const show = shallowRef(false)
const takePicture = async function () {
    $mobile.Toast.show({
        text: 'Isch mache ma foto wennsch darf',
        duration: 'long'
    })
    takenImage.value.permissions = await $mobile.Camera.requestPermissions
    const image = await $mobile.Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: $mobile.CameraResultType.Uri
    });

    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    var imageUrl = image.webPath;

    // Can be set to the src of an image now
    takenImage.value.src = imageUrl;
    takenImage.value.raw = image
    preview.value = true
}
onMounted(() => {
});
onUnmounted(() => {

});
</script>


<style lang="css">

</style>