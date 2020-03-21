<template>
  <div id="login">
    <div>
      <div class="logo">
        <img src="../../assets/Ar&Nar.png" alt="logo">
      </div>
      <v-form ref="form" v-model="valid" lazy-validation>

        <v-text-field
          v-model="adminUser.userName"
          :rules="rules.userName"
          label="User name"
          required
          autocomplete="off"
        ></v-text-field>

        <v-text-field
          v-model="adminUser.password"
          :rules="rules.password"
          label="Password"
          type="password"
          required
          autocomplete="off"
        ></v-text-field>

        <v-btn
          :disabled="!valid"
          color="success"
          class="mr-4 float-right"
          @click="validate"
        >
          Login
        </v-btn>
      </v-form>
    </div>
  </div>
</template>

<script>
  import Api from "../../../api/index";
  import Swal from "sweetalert2";

  export default {
    name: "login",
    data: () => ({
      valid: true,
      adminUser: {
        userName: "",
        password: ""
      },
      rules: {
        userName: [
          v => !!v || "User name is required",
        ],
        password: [
          v => !!v || "Password is required",
          v => (v && v.length >= 6) || "Password must be less than 6 characters"

        ],
      },
    }),

    methods: {
      validate() {
        if (this.$refs.form.validate()) {
          Api.post('/auth', this.adminUser).then(res => {
            this.$store.dispatch('login', res);
          })
            .catch(err => {
              console.log(err);
              Swal.fire({
                icon: 'error',
                title: "Admin not a found",
                text: "User name or password not a valid",
              })
            })
        }
      },
      // reset() {
      //   this.$refs.form.reset();
      // },
      // resetValidation() {
      //   this.$refs.form.resetValidation();
      // }
    }
  };
</script>

<style scoped lang="scss">
  #login {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    > div {
      width: 30%;

      .logo {
        display: flex;
        justify-content: center;
      }
    }
  }
</style>
