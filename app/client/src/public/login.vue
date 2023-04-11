<!-- login page -->
<template>
  <v-container fluid :style="{ height: $vuetify.display.height + 'px' }">
    <!-- center login form vertically with a 20% negative offset -->
  <v-row justify="center" align="center" :style="{
    height: $vuetify.display.height + 'px',
      marginTop: (-1) * $vuetify.display.height * 0.2 + 'px'
  }">

      <v-col col="12" md="6" lg="3">
        <!-- login form -->
        <v-form ref="form">
          <!-- Email -->
          <v-text-field v-model="email" :counter="50" :rules="emailRules" clearable label="E-Mail" required>
          </v-text-field>

          <!-- Password -->
          <v-text-field v-model="password" :counter="50" :rules="passwordRules" clearable type="password" label="Password"
            @keyup.enter="validate" required>
          </v-text-field>

          <!-- sign into last active project -->
          <v-checkbox v-model="singIntoLast" label="Sign in to last active Project?"></v-checkbox>

          <!-- buttons -->
          <div class="text-center">
            <!-- login -->
            <v-btn color="success" block class="mb-6" @click="validate">
              Login
            </v-btn>
            <!-- reset -->
            <v-btn variant="text" class="mt-4" @click="reset">
              Reset Form
            </v-btn>
            <!-- password forgotten -->
            <v-btn variant="text" class="mt-4" @click="reset">
              Password forgotten
            </v-btn>
          </div>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { setHttpToken } from '../lib/httpClient.js'

export default {
  inject: ["$api", "$store", "$session"],
  data: () => ({
    valid: true,
    email: '',
    password: '',
    emailRules: [
      v => !!v || 'email is required',
      v => (v && v.length <= 50) || 'email must be less than 10 characters',
    ],
    passwordRules: [
      v => !!v || 'Password is required',
      v => (v && v.length <= 50) || 'Password must be less than 10 characters',
    ],
    singIntoLast: true,
  }),

  mounted() {
    // TODO WHY DON'T WE GET THE REQUESTURI Param which se set in sessionHandler before redirect here?
    this.$session.checkToken().then(user => {
      if (!user) return
      this.redirectAfterLogin(user.data?.ux?.lastProjectId || false)
    })
  },
  methods: {
    /* validate and send login form */
    async validate() {
      const { valid } = await this.$refs.form.validate()
      // early return if invalid login formula
      if (!valid) return false
      // request login token and user object
      const user = await this.postLogin()
      // set user object in store
      this.$store.dispatch({ type: 'user/set', payload: user.data.user })
      // set token in http client
      setHttpToken(this.$api, user.data.token)
      // save token to local storage
      localStorage.setItem("USER_TOKEN", user.data.token);
      // redirect after login
      this.redirectAfterLogin(user.data?.user?.ux?.lastProjectId || false)
    },

    /* redirect after login depending on user config and login form checkbox */
    redirectAfterLogin(lastProjectId) {
      if (this.$route?.query?.redirect) {
        return this.$router.push({
          path: this.$route.query.redirect,
          query: { redirect: this.$route.query.redirect }
        });
      }
      if (this.singIntoLast && lastProjectId) {
        return this.$router.push({
          name: 'app.project.index',
          params: {
            projectId: lastProjectId
          },
        });
      }
      // otherweise redirect to project selection
      return this.$router.push({
        name: 'app.project.select'
      });
    },

    /* post login form */
    async postLogin() {
      const user = await this.$api.post(
        '/core/user/login', {
        email: this.email,
        password: this.password
      })
      return user ? user : false
    },

    /* reset login form */
    reset() {
      this.$refs.form.reset()
    },

    /* reset login form validation */
    resetValidation() {
      this.$refs.form.resetValidation()
    },
  },
}
</script>
