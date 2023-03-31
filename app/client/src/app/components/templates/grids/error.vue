<template>
  <v-container data-test-id="errorContainer" fluid class="pa-0 ma-0">
    <v-alert prominent type="error">
      something regarding the grid config is messed up
    </v-alert>
  </v-container>
  <slot></slot>
</template>
