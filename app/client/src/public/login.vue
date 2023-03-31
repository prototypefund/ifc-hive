<template>
  <v-container>
    <h1>Login</h1>
    <v-sheet width="300" class="mx-auto">

      <v-form ref="form">
        <v-text-field v-model="name" :counter="10" :rules="nameRules" clearable label="Name" required></v-text-field>
        <v-text-field v-model="password" :counter="10" :rules="passwordRules" clearable type="password" label="Password"
          required></v-text-field>
        <!--v-select v-model="select" :items="items" :rules="[v => !!v || 'Item is required']" label="Item"
          required></!--v-select-->

        <v-checkbox v-model="checkbox" label="Sign in to last active Project?"></v-checkbox>

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
export default {
  data: () => ({
    valid: true,
    name: '',
    password: '',
    nameRules: [
      v => !!v || 'Name is required',
      v => (v && v.length <= 10) || 'Name must be less than 10 characters',
    ],
    passwordRules: [
      v => !!v || 'Password is required',
      v => (v && v.length <= 10) || 'Password must be less than 10 characters',
    ],
    checkbox: false,
  }),

  methods: {
    async validate() {
      const { valid } = await this.$refs.form.validate()
      let projectId = false;
      if (valid) {
        if (this.checkbox) {
          this.$router.push({
            name: 'app.project.index',
            params: {
              id: 21564846453498
            },
          });
        } else {
          this.$router.push({
            name: 'app.project.select'
          });
        }

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