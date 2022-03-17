<template>
  <div style="background-color: #bddfbf">
    <n-page-header style="font-size: 16px; padding: 16px">
      Bem vindo, {{ claims.name }} !
    </n-page-header>
  </div>
</template>


<script>
import axios from "axios";


export default {
  name: "home",
  data: function () {
    return {
      claims: "",
      caffeineLevel: "",
      accessToken: "",
      size: 0,
      id_user: "",
      user: {
        username: "",
        password: "",
        dollar_balance: "",
        enabled: "",
      },
      stocksList: ["teste"]
    };
  },
  created() {
    this.setup();
    this.getIdUser();
  },
  methods: {
    async setup() {
      if (this.$root.authenticated) {
        this.claims = await this.$auth.getUser();
        console.log("username", this.claims.email);
        this.accessToken = this.$auth.getAccessToken();
        console.log(`Authorization: Bearer ${this.accessToken}`);
      }
    },

    async getIdUser() {
      this.accessToken = this.$auth.getAccessToken();
      const config = {
        headers: { Authorization: "Bearer " + this.accessToken },
      };
      this.claims = await this.$auth.getUser();
      let username = this.claims.email;
      try {
        let response = await axios.get(
          `http://localhost:8080/api/users/username/${username}`,
          config
        );
        this.id_user = response.data.id;
        console.log("id user", this.id_user);
      } catch (error) {
        if (error.response.status == 404) {
          this.createUser();
          console.log(error.response.status);
        }
      }
    },

    async createUser() {
      let password = "123456"
      this.accessToken = this.$auth.getAccessToken();
      const config = {
        headers: { Authorization: "Bearer " + this.accessToken },
      };
      this.user.username = this.claims.email;
      this.user.password = password;
      this.user.dollar_balance = 1000;
      this.user.enabled = true;
      const data = this.user;
      console.log(data);
      try {
        let response = await axios.post(
          `http://localhost:8080/api/new_user`,
          data,
          config
        );
        console.log(response);
      } catch (error) {
        let response = `${error}`;
        console.log(response);
      }
    },

  },
};
</script>

<style>
.light-green {
  height: 100%;
  background-color: rgb(156, 211, 221);
}

.light-blue2 {
  background-color: #90dae7ad;
}

#home {
  background-color: rgb(144, 218, 231, 0.678);
}
</style>