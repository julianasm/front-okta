<template>
  <div id="home">
    <n-modal v-model:show="showModal">
      <n-card
        style="width: 800px; color: white"
        title="Nova ordem"
        bordered
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <n-card title="Saldo" size="small">
          <h3>USD$ {{ user.dollarBalance }}.00</h3>
        </n-card>
        <n-form style="padding: 10px" @submit="saveOrder()">
          <n-form-item label="Selecione o tipo de ordem" path="radioGroupValue">
            <n-radio-group v-model:value="model.radioGroupValue">
              <n-space>
                <n-radio v-model:value="tipo1" @click="searchAllStocks()"
                  >Compra</n-radio
                >
                <n-radio v-model:value="tipo2" @click="userStocksForSell()"
                  >Venda</n-radio
                >
              </n-space>
            </n-radio-group>
          </n-form-item>
          <n-form-item label="Selecione a ação desejada">
            <n-select
              :options="options"
              v-model:value="model.selectedValue"
              filterable
            />
          </n-form-item>
          <n-form-item label="Quantidade">
            <n-input-number
              v-model:value="model.volumeValue"
              placeholder="Input"
              :default-value="1"
              :min="1"
            />
          </n-form-item>
          <n-form-item label="Preço">
            <n-input-number
              v-model:value="model.priceValue"
              placeholder="Insira o valor"
              :default-value="1"
              :min="1"
            >
              <template #prefix>R$</template>
            </n-input-number>
          </n-form-item>
        </n-form>
        <n-button @click="mountOrder()"> Salvar </n-button>
      <n-alert v-if="success" title="Success Text" type="success" closable>
        Ordem criada com sucesso!
      </n-alert>
      <n-alert v-if="erro" title="Success Text" type="warning" closable>
        Saldo insuficiente para a ordem desejada.
      </n-alert>
      </n-card>
    </n-modal>
    <n-card
      v-if="orders.length > 0"
      bordered
      style="
        min-height: 670px;
        display: block;
        background-color: #bddfbf;
        padding: 15px;
      "
    >
      <n-row gutter="12">
        <n-col :span="4">
          <h2>Seu historico de ordes</h2>
        </n-col>
        <n-col :span="4">
          <n-button
            @click="showModal = true"
            strong
            color="white"
            round
            style="margin: 20px"
          >
            <h4 style="color: black">Abrir nova ordem</h4>
          </n-button>
        </n-col>
      </n-row>
      <n-layout style="border-radius: 20px">
        <n-layout-content>
          <n-table :bordered="true" :single-line="false">
            <thead>
              <tr>
                <th scope>Nome</th>
                <th scope>Símbolo</th>
                <th scope>Quantidade</th>
                <th scope>Preço</th>
                <th scope>Tipo</th>
                <th scope>Status</th>
                <th scope>Data de abertura</th>
                <th scope>Gerenciar</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in orders" :key="i">
                <td>{{ item.stockName }}</td>
                <td>{{ item.stockSymbol }}</td>
                <td>{{ item.volume }}</td>
                <td>{{ item.price }}</td>
                <td v-if="item.type == 1">Compra</td>
                <td v-else>Venda</td>
                <td v-if="item.status == 1">Aberta</td>
                <td v-else>Fechada</td>
                <td>
                  <n-time
                    v-if="item.createdOn != null"
                    :time="Date.parse(item.createdOn)"
                    format="dd/MM/yyyy"
                  ></n-time>
                </td>
                <td v-if="item.remainingVolume > 0">
                  <n-button
                    v-if="item.status == 1"
                    @click="changeStatus(item.status, item.id)"
                  >
                    Cancelar
                  </n-button>
                  <n-button v-else @click="changeStatus(item.status, item.id)">
                    Abrir
                  </n-button>
                </td>
                <td v-else>Ordem finalizada</td>
              </tr>
            </tbody>
          </n-table>
          <n-pagination
            style="padding: 15px"
            v-model:page="page"
            :page-count="totalPages"
            @click="changePage()"
          />
        </n-layout-content>
      </n-layout>
    </n-card>
    <n-card
      v-else-if="orders.length == 0"
      bordered
      style="min-height: 750px; background-color: #dff0e0"
    >
      Você ainda não possui um histórico de ordens.
      <n-button
        @click="showModal = true"
        strong
        color="white"
        round
        style="margin: 20px"
      >
        <h4 style="color: black">Abrir nova ordem</h4>
      </n-button>
    </n-card>
  </div>
</template>


<script>
import axios from "axios";
import { ref } from "vue";

export default {
  name: "home",
  data: function () {
    return {
      claims: "",
      caffeineLevel: "",
      stockName: "",
      stocks: {},
      accessToken: "",
      user: "",
      venda: false,
      options: [{}],
      orders: [],
      updateOrder: {
        id: "",
      },
      AllStockOptions: [],
      stockInfo: {},
      model: ref({
        radioGroupValue: null,
        volumeValue: null,
        priceValue: null,
        selectedValue: null,
      }),
      showModal: ref(false),
      preco: 0,
      tipo1: 1,
      tipo2: 2,
      userOrder: {
        idUser: "",
        idStock: "",
        stockSymbol: "",
        stockName: "",
        volume: "",
        price: "",
        type: "",
        status: "",
        remainingVolume: "",
      },
      success: '',
      totalPages: 0,
      page: -1,
      erro: ""
    };
  },

  created() {
    this.setup();
      this.getIdUser();
      this.getOpenOrders();
      this.getUserStockBalance();
      this.getUserDollarBalance();
  },
  methods: {
    async setup() {
      if (this.$root.authenticated) {
        this.claims = await this.$auth.getUser();
        console.log("teste para pegar id do user", this.claims);
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
        this.idUser = response.data.id;
      } catch (error) {
        if (error.response.status == 404) {
          this.createUser();
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
      this.getIdUser();
      try {
        let response = await axios.get(
          `http://localhost:8080/api/user_stock/${this.idUser}`,
          config
        );
        this.stocks = response.data;
      } catch (error) {
        this.stocks = `${error}`;
      }
    },

    clearStockInfo() {
      this.options = [{}];
    },

    async userStocksForSell() {
      await this.getIdUser();
      this.options.label = "";
      this.options.value = "";
      this.tipo = 2;
      this.venda = true;
      this.accessToken = this.$auth.getAccessToken();
      const config = {
        headers: { Authorization: "Bearer " + this.accessToken },
      };
      try {
        let response = await axios.get(
          `http://localhost:8080/api/user_stock/${this.idUser}`,
          config
        );
        console.log(response)
        this.AllStockOptions = response.data;
      } catch (error) {
        this.AllStockOptions = `${error}`;
      }
      if (this.venda) {
        this.options = this.AllStockOptions.map((v) => ({
          label: v.stockName,
          value: v.idStock,
        }));
      }
      this.venda = !this.venda;
    },

    async getUserDollarBalance() {
      await this.getIdUser();
      this.accessToken = this.$auth.getAccessToken();
      const config = {
        headers: { Authorization: "Bearer " + this.accessToken },
      };
      try {
        let response = await axios.get(
          `http://localhost:8080/api/users/${this.idUser}`,
          config
        );
        this.user = response.data;
      } catch (error) {
        this.user = `${error}`;
      }
    },

    async searchAllStocks() {
      this.options.label = "";
      this.options.value = "";
      this.tipo = 1;
      this.accessToken = this.$auth.getAccessToken();
      const config = {
        headers: { Authorization: "Bearer " + this.accessToken },
      };
      try {
        let response = await axios.get(`http://localhost:8080/stocks/`, config);
        this.AllStockOptions = response.data;
        this.options = this.AllStockOptions.map((v) => ({
          label: v.stockName,
          value: v.id,
        }));
      } catch (error) {
        this.AllStockOptions = `${error}`;
      }
    },

    async findStockName(idStock) {
      this.accessToken = this.$auth.getAccessToken();
      const config = {
        headers: { Authorization: "Bearer " + this.accessToken },
      };
      // find STOCK NAME pelo simbolo
      let response = await axios.get(
        `http://localhost:8080/stock-info/${idStock}`,
        config
      );
      this.stockInfo = response.data;
    },

    async mountOrder() {
      console.log(
        "o que vem no selected value da venda",
        this.model.selectedValue
      );
      await this.findStockName(this.model.selectedValue);
      this.userOrder.idUser = this.idUser;
      this.userOrder.idStock = this.stockInfo.id;
      this.userOrder.stockName = this.stockInfo.stockName;
      this.userOrder.stockSymbol = this.stockInfo.stockSymbol;
      this.userOrder.volume = this.model.volumeValue;
      this.userOrder.price = this.model.priceValue;
      this.userOrder.type = this.tipo;
      this.userOrder.status = 1;
      this.userOrder.remainingVolume = this.model.volumeValue;
      console.log(this.userOrder);
      this.saveOrder(this.userOrder);
    },

    async saveOrder(orderInfo) {
      const data = orderInfo;
      this.accessToken = this.$auth.getAccessToken();
      const config = {
        headers: { Authorization: "Bearer " + this.accessToken },
      };
      try {
        let response = await axios.post(
          "http://localhost:8080/api/new_order",
          data,
          config
        );
        this.success = response.status;
        this.getOpenOrders();
        return response;
      } catch (error) {
        if (error.response.status == 400){
          this.erro = error;
        }
      }
    },

    async getOpenOrders() {
      await this.getIdUser();
      this.accessToken = this.$auth.getAccessToken();
      const config = {
        headers: { Authorization: "Bearer " + this.accessToken },
      };
      console.log(config);
      try {
        let pageSize = 5;
        let pageNumber = 0;
        let response = await axios.get(
          `http://localhost:8080/api/orders/${this.idUser}?pageSize=${pageSize}&pageNumber=${pageNumber}`,
          config
        );
        let orders = response.data.content;
        this.totalPages = response.data.totalPages - 1;
        this.page = pageNumber;
        this.orders = orders;
      } catch (error) {
        console.log(error);
      }
    },

    async changeStatus(status, id) {
      console.log(status, id);
      this.accessToken = this.$auth.getAccessToken();
      const config = {
        headers: { Authorization: "Bearer " + this.accessToken },
        "Access-Control-Allow-Origin": "http://localhost:8081",
      };
      this.updateOrder.id = id;
      const data = this.updateOrder;
      if (status == 1) {
        let newStatus = 0;
        try {
          let response = await axios.post(
            `http://localhost:8080/api/order-update/${newStatus}`,
            data,
            config
          );
          console.log(response);
        } catch (error) {
          console.log(error);
        }
      } else if (status == 0) {
        let newStatus = 1;
        try {
          let response = await axios.post(
            `http://localhost:8080/api/order-update/${newStatus}`,
            data,
            config
          );
          console.log(response);
        } catch (error) {
          console.log(error);
        }
      }
    },

    async changePage() {
      this.accessToken = this.$auth.getAccessToken();
      const config = {
        headers: { Authorization: "Bearer " + this.accessToken },
      };
      console.log(config);
      try {
        let pageSize = 5;
        let response = await axios.get(
          `http://localhost:8080/api/orders/${this.idUser}?pageSize=${pageSize}&pageNumber=${this.page}`,
          config
        );
        let orders = response.data.content;
        this.totalPages = response.data.totalPages - 1;
        this.orders = orders;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
</style>