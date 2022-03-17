<template>
  <div id="app2">
    <nav title="Solinf Broker">
      <div>
        <n-button round style="margin: 16px" color="white">
          <router-link style="text-decoration: none; color: black" to="/">
            Home
          </router-link>
          <n-space></n-space>
        </n-button>
        <n-button
          v-if="!authenticated"
          color="white"
          round
          style="margin: 16px"
        >
          <router-link
            style="text-decoration: none; color: black"
            to="/login"
            v-if="!authenticated"
          >
            Login
          </router-link>
        </n-button>
        <n-button color="white" round>
          <router-link
            style="text-decoration: none; color: black"
            to="/balance"
          >
            Ballance
          </router-link>
        </n-button>
        <n-button style="margin: 16px" color="white" round>
          <router-link style="text-decoration: none; color: black" to="/order">
            Order
          </router-link>
        </n-button>
        <n-button round style="margin: 16px" color="white">
          <router-link style="text-decoration: none; color: black" to="/stocks">
            Stock Prices
          </router-link>
          <n-space></n-space>
        </n-button>
        <n-button style="margin: 16px" color="white" round v-if="authenticated">
          <router-link
            style="text-decoration: none; color: black"
            to="/profile"
          >
            Profile
          </router-link>
        </n-button>
        <n-button v-if="authenticated" style="margin: 16px" round color="white">
          <a v-on:click="logout()" style="text-decoration: none; color: black">
            Logout
          </a>
        </n-button>
      </div>
    </nav>
    <div></div>
  </div>
  <div id="content"></div>
  <router-view />
  <footer style="width: 100%">
    <n-button color="white" style="margin: 16px" round>
      <router-link style="text-decoration: none; color: black" to="/order">
        Contato
      </router-link>
    </n-button>
    <n-button color="white" round>
      <router-link style="text-decoration: none; color: black" to="/order">
        Suporte
      </router-link>
    </n-button>
  </footer>
</template>

<script>

export default {
  name: "app",
  data: function () {
    return { authenticated: false };
  },

  async created() {
    await this.isAuthenticated();
    this.$auth.authStateManager.subscribe(this.isAuthenticated);
  },
  watch: {
    // Everytime the route changes, check for auth status
    $route: "isAuthenticated",
  },
  methods: {
    async isAuthenticated() {
      this.authenticated = await this.$auth.isAuthenticated();
    },
    async logout() {
      await this.$auth.signOut();
    },
  },
};
</script>

<style>
div a {
  margin-right: 10px;
}
#app {
  width: 100%;
  margin: 0 auto;
  background-color: rgba(144, 218, 231, 0.678);
}
nav {
  width: 100%;
  background-color: #328094a4;
}

footer {
  background-color: #328094a4;
}
</style>