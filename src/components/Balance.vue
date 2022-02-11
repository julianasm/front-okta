<template>
  <div id="home">
  <n-page-header title="Saldo de ações">
<n-table :bordered="false" :single-line="false">
    <thead>
      <tr>
        <th>Nome</th>
        <th>Símbolo</th>
        <th>Quantidade</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{{stocks.stock_name}}</td>
        <td>{{stocks.stock_symbol}}</td>
        <td>{{stocks.volume}}</td>
      </tr>
    </tbody>
    </n-table>

  <n-layout has-sider>
<n-layout-sider>
    <h2>
      Saldo monetário
    </h2>
      <h3>
       USD$ {{user.dollar_balance}}.00
      </h3>
    </n-layout-sider>
  </n-layout>
  </n-page-header>
  </div>
</template>


<script>
import axios from 'axios';
import { NTable } from 'naive-ui'
import { NPageHeader } from 'naive-ui'
import { NLayout } from 'naive-ui' 

export default {
  components: {
    NTable,
    NPageHeader,
    NLayout
  },
  name: 'home',
  data: function () {
    return {
      claims: '',
      caffeineLevel: '',
      stocks: {},
      accessToken: '',
      user: ''
    }
  },
  created () { this.setup(), this.getUserStockBalance(), this.getUserDollarBalance() },
  methods: {
    async setup () {
      if (this.$root.authenticated) {
        this.claims = await this.$auth.getUser()
        this.accessToken = this.$auth.getAccessToken();
        console.log(`Authorization: Bearer ${this.accessToken}`);
      }
    },

   async getUserStockBalance(){
      this.accessToken = this.$auth.getAccessToken();
      const config = {
      headers: { 'Authorization': 'Bearer ' + this.accessToken }
      };
      console.log(config)
      let id_user = 1;
      let idStock = 1;
      try {
          let response = await axios.get(`http://localhost:8080/api/user_stock/${id_user}/${idStock}`,
          config)
          this.stocks = response.data;
          console.log("teste", this.stocks)
      
      }
      catch (error) {
        this.stocks = `${error}`
      }
    },

    async getUserDollarBalance() {
      this.accessToken = this.$auth.getAccessToken();
      const config = {
      headers: { 'Authorization': 'Bearer ' + this.accessToken }
      };
      let id_user = 1;
      try {
          let response = await axios.get(`http://localhost:8080/api/users/${id_user}`,
          config)
          this.user = response.data;
          console.log("user", this.user)
      } catch (error) {
        this.user = `${error}`
      }

    }
  }
}
</script>