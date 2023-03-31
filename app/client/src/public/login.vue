<template>
  <v-container>
    <v-sheet width="300" class="mx-auto">
      <v-form ref="form">
        <v-text-field v-model="email" :counter="50" :rules="emailRules" clearable label="EMail" required></v-text-field>
        <v-text-field v-model="password" :counter="50" :rules="passwordRules" clearable type="password" label="Password"
          required></v-text-field>
        <!--v-select v-model="select" :items="items" :rules="[v => !!v || 'Item is required']" label="Item"
          required></!--v-select-->

        <v-checkbox v-model="singIntoLast" label="Sign in to last active Project?"></v-checkbox>

        <div class="d-flex flex-column">
          <v-btn color="success" class="mt-4" block @click="validate">
            Login
          </v-btn>

          <v-btn color="error" class="mt-4" block @click="reset">
            Reset Form
          </v-btn>
        </div>
      </v-form>
    </v-sheet>
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
    const token = localStorage.getItem("USER_TOKEN")
    if (token) {
      setHttpToken(this.$api, token)
      this.$router.push({
        name: 'app.project.select'
      });
    }
  },
  methods: {
    async validate() {
      const { valid } = await this.$refs.form.validate()
      if (valid) {
        this.$api.post(
          '/core/user/login',
          {
            email: this.email,
            password: this.password
          }).then((user) => {
            if (user && user.data) {
              if (user.data.user) {
                this.$store.dispatch({
                  type: 'user/udpate',
                  payload: user.data.user
                })
                setHttpToken(this.$api, user.data.token)
                localStorage.setItem("USER_TOKEN", user.data.token);
                if (user.data.config) {
                  if (this.singIntoLast && (user.data.config.lastProjectId)) {
                    this.$router.push({
                      name: 'app.project.index',
                      params: {
                        id: user.data.config.lastProjectId
                      },
                    });
                  } else {
                    this.$router.push({
                      name: 'app.project.select'
                    });
                  }
                } else {
                  this.$router.push({
                    name: 'app.project.select'
                  });
                }
              }
            } else {
              debugger
            }
          })
      }
    },
    reset() {
      this.$refs.form.reset()
    },
    resetValidation() {
      this.$refs.form.resetValidation()
    },
  },
}
</script>