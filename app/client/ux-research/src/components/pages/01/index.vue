<template>
    <v-container fluid class="ma-0 pa-0 bg-blue" :style="{ height: `${height - 48}px` }">
      <v-row class="fill-height" justify="center" align="center">
        <v-col cols="4" class="text-center">
          <h1 class="text-h2">I'm a page filling up the complete content area</h1>
          <div class="text-body-1 mt-5">
            I'm a page and mostly I'll consist of multiple widgets. However I
            also might represent a single widget.
          </div>
        </v-col>
      </v-row>
    </v-container>
</template>

<script>
import { onMounted } from 'vue'
import { useDisplay } from 'vuetify'

export default {
  setup() {
    const { height, width } = useDisplay()

    return { height, width }
  }
}
</script>
