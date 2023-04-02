<template>
  <v-container fluid
    :style="{ height: $vuetify.display.height + 'px' } "
  >
    <!-- center login form vertically with a 20% negative offset -->
    <v-row justify="center" align="center" 
      :style="{
        height: $vuetify.display.height + 'px',
        marginTop: (-1) * $vuetify.display.height * 0.2 + 'px' }"
      >

        <v-col col="12" md="6" lg="3">
          <!-- login form -->
          <v-form ref="form">
            <!-- Email -->
            <v-text-field
              v-model="email"
              :counter="50"
              :rules="emailRules"
              clearable
              label="E-Mail"
              required>
            </v-text-field>

            <!-- Password -->
            <v-text-field
              v-model="password"
              :counter="50"
              :rules="passwordRules"
              clearable
              type="password"
              label="Password"
              @keyup.enter="validate"
              required>
            </v-text-field>

            <!-- sign into last active project -->
            <v-checkbox v-model="singIntoLast" label="Sign in to last active Project?"></v-checkbox>

            <!-- buttons -->
            <div class="text-center">
              <!-- login -->
              <v-btn color="success" block class="mb-6"  @click="validate">
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
  inject: ["$api", "$store"],
  data: () => ({
    valid: true,
    name: '',
    password: '',
    emailRules: [
      v => !!v || 'email is required',
      v => (v && v.length <= 50) || 'email must be less than 10 characters',
    ],
    passwordRules: [
      v => !!v || 'Password is required',
      v => (v && v.length <= 50) || 'Password must be less than 10 characters',
    ],
    singIntoLast: false,
  }),

  mounted() {
    // @TODO actually this should happen in main.js since users might come via
    // deep link. so on any route we would need to check, if there is a user
    // token in local storage if it is still valid, get the user object and
    // move on the requested route or the project selection page.
    this.checkToken(localStorage.getItem("USER_TOKEN"))
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
      this.$store.dispatch({ type: 'user/update', payload: user.data.user })
      // set token in http client
      setHttpToken(this.$api, user.data.token)
      // save token to local storage
      localStorage.setItem("USER_TOKEN", user.data.token);
      // redirect after login
      this.redirectAfterLogin(user)
    },

    /* redirect after login depending on user config and login form checkbox */
    redirectAfterLogin (user) {
      // if applicable redirect to last project
      if (this.singIntoLast && (user.data?.config?.lastProjectId)) {
        return this.$router.push({
          name: 'app.project.index',
          params: {
            id: user.data.config.lastProjectId
          },
        });
      }
      // otherweise redirect to project selection
      return this.$router.push({
        name: 'app.project.select'
      });
    },

    /* post login form */
    async postLogin () {
      const user = await this.$api.post(
        '/core/user/login', {
          email: this.email,
          password: this.password
        })
        return user ?  user : false
    },

    /* check token and receive user object if valid */
    async checkToken (token) {
      if (!token) return false
      // set token in client
      setHttpToken(this.$api, token)
      // check if token is valid
      const res = await this.$api.get('/core/user/check-token')
      // early return if no result
      if (!res) return false
      // save received user object to store
      this.$store.dispatch({ type: 'user/update', payload: res.data })
      // redirect to project selection 
      this.$router.push({ name: 'app.project.select' });
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
