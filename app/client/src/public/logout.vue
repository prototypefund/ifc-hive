<template>
  LOIGOUT
</template>

<script>
import { setHttpToken } from '../lib/httpClient.js'

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
