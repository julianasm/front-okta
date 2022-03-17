<template>
  <n-row gutter="12">
    <n-col :span="6">
      <n-card
        style="background-color: #90dae7ad; min-width: 700px; min-height: 700px"
        title="Saldo de ações"
      >
        <n-table
          v-if="stocks.length > 0"
          style="border-radius: 10px; width: 600px"
          :bordered="false"
          :single-line="false"
        >
          <thead>
            <tr>
              <th scope>Nome</th>
              <th scope>Símbolo</th>
              <th scope>Quantidade</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in stocks" :key="i">
              <td>{{ item.stockName }}</td>
              <td>{{ item.stockSymbol }}</td>
              <td>{{ item.volume }}</td>
            </tr>
          </tbody>
        </n-table>
        <h3 v-else>Você ainda não comprou nenhuma ação.</h3>
      </n-card>
    </n-col>
    <n-col :span="6" :offset="6">
      <n-card style="background-color: #90dae7ad; height: 400px">
        <h2>Saldo monetário</h2>
        <h3 v-if="user.dollarBalance != null">
          USD$ {{ user.dollarBalance }}.00
        </h3>
        <h3 v-else>R$ 00.00</h3>
      </n-card>
    </n-col>
  </n-row>
</template>


<script>
import axios from "axios";

export default {
  name: "balance",
  data: function () {
    return {
      id_user: "",
      claims: "",
      caffeineLevel: "",
      stocks: {},
      accessToken: "",
      user: "",
    };
  },
  created() {
    this.setup(); 
    this.getUserStockBalance();
    this.getUserDollarBalance();
  },
  methods: {
    async setup() {
      if (this.$root.authenticated) {
        this.claims = await this.$auth.getUser();
        this.accessToken = this.$auth.getAccessToken();
        console.log(`Authorization: Bearer ${this.accessToken}`);
        this.getIdUser();
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
      } catch (error) {
        if (error.response.status == 404) {
          console.log(error.response.status);
        }
      }
    },

    async getUserStockBalance() {
      await this.getIdUser();
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
      await this.getIdUser();
      this.accessToken = this.$auth.getAccessToken();
      const config = {
        headers: { Authorization: "Bearer " + this.accessToken },
      };
      try {
        let response = await axios.get(
          `http://localhost:8080/api/users/${this.id_user}`,
          config
        );
        console.log(response.data);
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