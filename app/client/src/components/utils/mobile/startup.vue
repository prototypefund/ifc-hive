<template></template>
<script>
import { defineCustomElements } from "@ionic/pwa-elements/loader";
export default {
  inject: ["$mobile"],
  created() {
    if (this.$mobile) {
      defineCustomElements(window);
      // TODO leave this here or move it to a hook file which comes from capacitor src?
      this.$mobile.Toast.show({
        text: "Capacitor ist ne geile Sau wenn das Grundframework ne geile Sau ist!",
        duration: "long",
      }).then(async () => {
        this.$mobile.SplashScreen.hide();
      });
    }
  },
};
</script>
