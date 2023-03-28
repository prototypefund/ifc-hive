<template>
  <v-container>
    <v-row justify="center" class="mt-10">
      <v-col cols="2">
      </v-col>
      <v-col cols="2">
        <h3 class="text-h4"> Settings </h3>
      </v-col>
      <v-col cols="2" class="text-right">
        <v-btn color="primary">save</v-btn>
      </v-col>
    </v-row>
    <v-row justify="center" class="mt-6">
      <v-col cols="12" lg="2">
        <v-list
          :lines="false"
          density="compact"
          nav
        >
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :value="item"
            active-color="primary"
          >
            <template v-slot:prepend>
              <v-icon :icon="item.icon"></v-icon>
            </template>

            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item>
        </v-list>
      </v-col>

      <v-col cols="12" lg="4">
        <h3 class="text-h5 mb-4">Subsection from local nav</h3>

        <p class="mb-6">
          A very simple and plain form. Lorem ipsum dolor sit amet, consetetur
          sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
          dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam
          et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
          takimata sanctus est Lorem ipsum dolor sit amet. 
        </p>

        <v-text-field label="First name" type="text" />
        <v-text-field label="Last name" type="text" />
        <v-text-field label="E-Mail" type="email" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { reactive } from 'vue'
export default {
  setup() {
    const items = reactive([
      { text: 'Your personal information', icon: 'mdi-account-circle'  },
      { text: 'Second section', icon: 'mdi-account-circle'  },
      { text: 'And another one', icon: 'mdi-account-circle'  },
    ])

    return { items }
  }
}
</script>
