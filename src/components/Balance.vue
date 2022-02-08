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
      <tr v-for="(item, i) in stocks" :key="i" >
        <td>{{item.stock_name}}</td>
        <td>{{item.stock_symbol}}</td>
        <td>{{item.volume}}</td>
      </tr>
    </tbody>
    </n-table>
  </n-page-header>
  </div>
</template>


<script>
import axios from 'axios';
import { NTable } from 'naive-ui'
import { NPageHeader } from 'naive-ui'

export default {
  components: {
    NTable,
    NPageHeader
  },
  name: 'home',
  data: function () {
    return {
      claims: '',
      caffeineLevel: '',
      stocks: {},
      accessToken: '',
    }
  },
  created () { this.setup(), this.getUserStockBalance() },
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
    }
  }
}
</script>