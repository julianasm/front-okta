<template>
  <div id="home">
    <h1>Okta Single-Page App Demo</h1>
    <div v-if="!this.$root.authenticated">
      <v-card>
        <v-list>
          <v-list-item
            v-for="(item, i) in orders"
            :key="i">
          </v-list-item>
        </v-list>
      </v-card>
    </div>

    <div v-if="this.$root.authenticated">
      <p>Welcome, {{claims.name}}!</p>
      <p>
        {{this.caffeineLevel}}
      </p>
    </div>
  </div>
</template>

<script>

import axios from 'axios';

export default {
  name: 'home',
  data: function () {
    return {
      claims: '',
      caffeineLevel: '',
      orders: [],
      accessToken: ''
    }
  },
  created () { this.setup() },
  methods: {
    async setup () {
      if (this.$root.authenticated) {
        this.claims = await this.$auth.getUser()
        this.accessToken = this.$auth.getAccessToken();
        console.log(`Authorization: Bearer ${this.accessToken}`);
        try {
          let response = await axios.get('http://localhost:8081/howcaffeinatedami',
              { headers: {'Authorization': 'Bearer ' + this.accessToken } } );
          this.caffeineLevel = response.data;
        }
        catch (error) {
          this.caffeineLevel = `${error}`
        }
      }
    },

    async getOpenOrders(){
      const config = {
      headers: { 'Authorization': 'Bearer' + this.accessToken }
      };
      try {
          let response = await axios.get('http://lkocalhost:8081/api/orders',
          config)
          this.orders = response.data;
      }
      catch (error) {
        this.orders = `${error}`
      }
    }
  }
}
</script>