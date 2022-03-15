<template>
  <div>
    <h3 style="padding: 10px">Preços de stocks atualizados</h3>
    <n-card style="min-height: 675px">
      <n-table :bordered="false" :single-line="false">
        <thead>
          <tr>
            <th scope>Nome</th>
            <th scope>Simbolo</th>
            <th scope>Ask min</th>
            <th scope>Ask max</th>
            <th scope>Bid min</th>
            <th scope>Bid max</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in stocks" :key="i">
            <td>{{ item.stock_name }}</td>
            <td>{{ item.stock_symbol }}</td>
            <td v-if="item.ask_min != null">
              {{ item.ask_min }}
            </td>
            <td v-else>0</td>
            <td v-if="item.ask_max != null">
              {{ item.ask_max }}
            </td>
            <td v-else>0</td>
            <td v-if="item.bid_min != null">
              {{ item.bid_min }}
            </td>
            <td v-else>0</td>
            <td v-if="item.bid_max != null">
              {{ item.bid_max }}
            </td>
            <td v-else>0</td>
          </tr>
        </tbody>
      </n-table>
    </n-card>
  </div>
</template>


<script>
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { NTable, NCard } from "naive-ui";
import axios from "axios";

export default {
  components: {
    NTable,
    NCard,
  },
  data: function () {
    return {
      stocks: [],
    };
  },
  created() {
    this.getStocks();
    this.Retorno();
  },

  methods: {
    async Retorno() {
      let accessToken = this.$auth.getAccessToken();
      console.log(accessToken)
      console.log("to entrando");
      const PauloTeste = (teste) => {
        if (teste) {
          this.stocks = teste;
        }
      };
      await fetchEventSource("http://localhost:8082/subscribe", {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
        onmessage(ev) {
          console.log("teste para ver se chegou");
          PauloTeste(JSON.parse(ev.data));
        },
        onerror(err) {
          if (err) {
            console.log("Sou do erro", err);
            throw err; // rethrow to stop the operation
          }
        },
      });
    },
    async getStocks() {
      let accessToken = this.$auth.getAccessToken();
      const config = {
        headers: { Authorization: "Bearer " + accessToken },
      };
      try {
        let response = await axios.get(`http://localhost:8082/stocks`, config);
        this.stocks = response.data;
        console.log(this.stocks);
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>
