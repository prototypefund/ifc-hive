<template>
  <v-row v-if="state">
    <v-col cols="12" md="6" lg="4" color="green">
      <div>
        <v-timeline side="end" align="end" class="mt-5">
          <v-timeline-item
            v-for="(entry, index) in state.entries"
            :key="index"
            size="small"
            :dot-color="entry.category.color"
          >
            <v-card-text class="pa-0">
              <v-chip label color="primary" size="small" class="mr-4"
                ># {{ entry.id }}</v-chip
              >
              <div
                class="mr-4 d-inline-block text-body-2"
                v-for="path in entry.path"
                :key="path"
              >
                <span>{{ path.text }}</span>
              </div>
            </v-card-text>

            <!-- <span class="text-body-2"> {{ entry.category.title }}</span> -->

            <div class="mt-2 mb-2">
              <v-chip
                label
                size="small"
                class="bg-grey-lighten-4"
                v-if="entry.locked > 1"
                dark
                :class="{ ['bg-grey-darken-2']: entry.locked === 3 }"
              >
                <v-icon size="18" class="mr-2" v-if="entry.locked >= 2">
                  {{ entry.locked === 2 ? "mdi-lock-clock" : "mdi-lock" }}
                </v-icon>
                # {{ entry.hash }}
              </v-chip>
            </div>

            <div style="width: 600px; margin-bottom: 80px">
              <v-alert v-if="entry.alert" :color="entry.alert.color" class="mb-2">
                <h3 class="text-subtitle-1">{{ entry.alert.content }}</h3>
                {{ $filters.dateFormat(entry.date) }}
              </v-alert>
              <QuickListHandler
                :uuid="entry.id"
                :props="entry"
                tab-type="detail"
                action="add"
              >
                <v-row
                  v-if="!entry.alert"
                  :class="{ ['bg-blue']: entry.id === current.id }"
                  class="pt-0 mt-0 mb-2"
                >
                  <v-col cols="12" sm="12" class="pt-0">
                    <span class="flex-shrink-0 mb-2">
                      {{ $filters.dateFormat(entry.date) }}
                    </span>
                    <h2>{{ entry.subject }}</h2>
                    <h4 class="text-subtitle-1 mt-0">
                      {{ entry.category.title }}
                    </h4>
                  </v-col>
                </v-row>
              </QuickListHandler>

              <div class="my-2" v-if="entry.tags && entry.tags.length > 0">
                <v-chip
                  label
                  color="blue"
                  v-for="tag in entry.tags"
                  :key="tag"
                  class="mr-2 mb-2"
                >
                  {{ tag }}
                </v-chip>
              </div>

              <v-card flat>
                <v-card-text class="pa-0">
                  <v-avatar size="30px" class="mr-2">
                    <v-img
                      alt="Avatar"
                      src="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460"
                    ></v-img>
                  </v-avatar>
                  Max Mustrmann
                  <div class="mt-2" v-if="entry.content" style="padding-right: 50px">
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
                    nonumy eirmod tempor invidunt
                    <v-chip size="x-small" color="primary" @click=""># 14</v-chip>
                    ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero
                    eos et accusam et justo duo dolores et
                    <v-chip label size="small" color="blue" dark>
                      <v-icon size="small" class="mr-2">mdi-account</v-icon>
                      John Doe
                    </v-chip>
                    ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
                    ipsum dolor sit amet.
                  </div>
                  <v-row class="my-4" v-if="entry.images">
                    <v-col v-for="n in 3" :key="n" class="d-flex child-flex" cols="2">
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
                </v-card-text>
              </v-card>

              <div class="my-2">
                <v-chip label v-if="entry.images">
                  <v-icon class="mr-2">mdi-image-multiple-outline</v-icon>
                  {{ entry.images }} Bilder
                </v-chip>
                <v-chip label v-if="entry.attachments">
                  <v-icon class="mr-2">mdi-attachment</v-icon>
                  {{ entry.attachments }} Dokumente
                </v-chip>
              </div>

              <div
                v-if="entry.request && entry.request.length > 0"
                class="ml-5 mb-4 mt-8"
              >
                <v-card
                  v-for="request in entry.request"
                  :key="entry.id + request.name"
                  class="mb-2 pl-4"
                  flat
                >
                  <v-card-text class="pa-0">
                    <v-chip label class="mr-4">
                      <v-icon
                        :color="
                          request.approved
                            ? 'success'
                            : request.approved === false
                            ? 'error'
                            : 'grey-lighten-1'
                        "
                      >
                        {{
                          request.approved
                            ? "mdi-check"
                            : request.approved === false
                            ? "mdi-close"
                            : "mdi-help-circle-outline"
                        }}
                      </v-icon>
                    </v-chip>

                    {{ request.name }} {{ request.date }}
                  </v-card-text>
                </v-card>
              </div>
            </div>
          </v-timeline-item>
        </v-timeline>
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
import { inject, ref, onMounted, onUnmounted, computed } from "vue";
import QuickListHandler from "@u/quicklist/handler.vue";

const $store = inject("$store");
const state = ref({});
const current = ref({ id: false });

const stateSubscriber$ = $store
  .select((state) => state.widgets[props.uuid])
  .subscribe((val) => {
    state.value = val;
  });

const props = defineProps({
  props: {
    type: Object,
  },
  uuid: {
    type: String,
  },
});

onMounted(() => {});
onUnmounted(() => {
  stateSubscriber$.unsubscribe();
});
</script>

<style lang="css">
.v-timeline .v-timeline-divider__dot {
  background: #e4e4e4;
}

.v-timeline-divider__dot--size-small {
  height: 20px;
  width: 20px;
}
</style>
