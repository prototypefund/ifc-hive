<template>
  <v-card flat v-if="entry.id">
    <v-card-text>
      <div v-if="!entry.alert">
        <h1 style="line-height: 1.4em">{{ entry.subject }}</h1>
      </div>

      <div v-if="entry.alert">
        <v-alert :color="entry.alert.color">
          <h1>{{ entry.alert.content }}</h1>
        </v-alert>
      </div>

      <v-row class="my-4" v-if="entry.images">
        <v-col v-for="n in 3" :key="n" class="d-flex child-flex" cols="4">
          <v-img
            :src="`https://picsum.photos/500/300?image=${n * 5 + 10}`"
            :lazy-src="`https://picsum.photos/10/6?image=${n * 5 + 10}`"
            aspect-ratio="1"
            cover
            class="bg-grey-lighten-2"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="grey-lighten-5"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-col>
      </v-row>

      <div class="mt-2 text-body-1">
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
        tempor invidunt <v-chip size="x-small" color="primary" @click=""># 14 </v-chip> ut
        labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et
        justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus
        est Lorem ipsum dolor sit amet.
      </div>

      <v-btn color="primary">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>

      <v-text-field label="CC" hint="Trag hier ewas ein" class="mt-5" />

      <v-text-field label="Subject" hint="Trag hier ewas ein" class="mt-5" />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
  props: {
    type: Object,
    default: () => ({}),
  },
});
const entry = ref(props.props);
</script>
