/**
  Root component
  This the neutral, global index file with the root router-view
 */
<template>
    <div>
        <router-view />
    </div>
</template>
<script>
import { globalPages } from "./setup/application";

export default {
  inject: ["$api", "$store", "$eventbus"],
  mounted() {
    globalPages(this.$store);
  },
}
</script>
