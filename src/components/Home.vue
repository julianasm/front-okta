<template>
  <div id="home">
  <n-list bordered>
    <template #header> hhh </template>
    <template #footer> fff </template>
    <n-list-item v-for="(item, i) in orders" :key="i">
      <n-thing title="Thing" title-extra="extra" description="description">
        {}
      </n-thing>
    </n-list-item>
    <n-list-item>
      <n-thing title="Thing" title-extra="extra" description="description" />
    </n-list-item>
  </n-list>
    </div>

    <div v-if="this.$root.authenticated">
      <p>Welcome, {{claims.name}}!</p>
      <p>
        {{this.caffeineLevel}}
      </p>
    </div>
</template>

<script>
import axios from 'axios';
import { NList } from 'naive-ui'
import { NListItem } from 'naive-ui'
import { NThing } from 'naive-ui'

export default {
  components: {
    NList,
    NListItem,
    NThing
  },
  name: 'home',
  data: function () {
    return {
      claims: '',
      caffeineLevel: '',
      orders: [],
      accessToken: ''
    }
  },
  created () { this.setup(), this.getOpenOrders },
  methods: {
    async setup () {
      if (this.$root.authenticated) {
        this.claims = await this.$auth.getUser()
        this.accessToken = this.$auth.getAccessToken();
        console.log(`Authorization: Bearer ${this.accessToken}`);
      }
    },

   async getOpenOrders(){
      const config = {
      headers: { 'Authorization': 'Bearer' + this.accessToken }
      };
      try {
          await axios.get('http://localhost:8081/api/orders',
          config).then(response => {
            this.orders = response.data;
            console.log("teste", this.orders);
          })      
      }
      catch (error) {
        this.orders = `${error}`
      }
    }
  }
}
</script>