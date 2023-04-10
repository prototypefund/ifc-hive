<!-- Logout page -->
<template>
  <h1>Logout</h1> 
</template>

<script>
export default {
  inject: ["$api", "$store", "$session"],
  data: () => ({
  }),

  mounted() {
    // TODO WHY DON'T WE GET THE REQUESTURI Param which se set in sessionHandler before redirect here?
    this.$session.logout()
  },
  props: {
    redirectURL: {
      type: String,
      required: false,
      default: null
    }
  },
}
</script>
