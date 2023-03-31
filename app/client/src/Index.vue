<template>
    <router-view />
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
