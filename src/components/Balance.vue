<template>
  <div id="balance">
    <n-card style="background-color: #90dae7ad; height: 350px" title="Saldo de ações">
      <n-table v-if="stocks.legnth > 0" :bordered="false" :single-line="false">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Símbolo</th>
            <th>Quantidade</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in stocks" :key="i">
            <td>{{ item.stock_name }}</td>
            <td>{{ item.stock_symbol }}</td>
            <td>{{ item.volume }}</td>
          </tr>
        </tbody>
      </n-table>
      <h3 v-else>
        Você ainda não comprou nenhuma ação.
      </h3>
      </n-card>
        <n-card style="background-color: #90dae7ad; height: 400px;">
          <h2>Saldo monetário</h2>
          <h3 v-if="user.dollar_balance != null">USD$ {{ user.dollar_balance }}.00</h3>
          <h3 v-else>R$ 00.00 </h3>
        </n-card>
  </div>
</template>


<script>
import axios from "axios";
import { NTable } from "naive-ui";
import { NCard } from 'naive-ui'

export default {
  components: {
    NTable,
    NCard
  },
  name: "balance",
  data: function () {
    return {
      id_user: '',
      claims: "",
      caffeineLevel: "",
      stocks: {},
      accessToken: "",
      user: "",
    };
  },
  created() {
    this.setup(), this.getUserStockBalance(), this.getUserDollarBalance();
  },
  methods: {
    async setup() {
      if (this.$root.authenticated) {
        this.claims = await this.$auth.getUser();
        this.accessToken = this.$auth.getAccessToken();
        console.log(`Authorization: Bearer ${this.accessToken}`);
        this.getIdUser()
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
        this.id_user = response.data.id
      } catch (error) {
        if (error.response.status == 404) {
          console.log(error.response.status);
        }
      }
    },

    async getUserStockBalance() {
      await this.getIdUser()
      this.accessToken = this.$auth.getAccessToken();
      const config = {
        headers: { Authorization: "Bearer " + this.accessToken },
      };
      console.log(config);
      try {
        let response = await axios.get(
          `http://localhost:8080/api/user_stock/${this.id_user}`,
          config
        );
        this.stocks = response.data;
      } catch (error) {
        this.stocks = `${error}`;
      }
    },

    async getUserDollarBalance() {
      await this.getIdUser()
      this.accessToken = this.$auth.getAccessToken();
      const config = {
        headers: { Authorization: "Bearer " + this.accessToken },
      };
      try {
        let response = await axios.get(
          `http://localhost:8080/api/users/${this.id_user}`,
          config
        );
        console.log(response.data)
        this.user = response.data;
      } catch (error) {
        this.user = `${error}`;
      }
    },
  },
};
</script>

<style scoped>


</style>