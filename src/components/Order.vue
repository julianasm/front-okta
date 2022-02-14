<template>
  <div id="home">
  <n-page-header title="Nova ordem">
  <n-form @submit="saveOrder()">
    <n-form-item label="Selecione o tipo de ordem" path="radioGroupValue">
      <n-radio-group v-model:value="model.radioGroupValue">
        <n-space>
          <n-radio v-model:value="tipo1" @click="searchAllStocks()">Compra</n-radio>
          <n-radio v-model:value="tipo2"  @click="userStocksForSell()">Venda</n-radio>
        </n-space>
      </n-radio-group>
    </n-form-item>
      <n-form-item label="Selecione a ação desejada">
       <n-select
          :options="options"
          v-model:value="model.selectedValue"
          filterable
          @blur="clearStockInfo()"
       />
    </n-form-item>
    <n-form-item  label="Quantidade">
      <n-input-number v-model:value="model.volumeValue" placeholder="Input" :default-value="1" :min="1"/>
    </n-form-item>
    <n-form-item  label="Preço">
      <n-input-number  v-model:value="model.priceValue" placeholder="Insira o valor" :default-value="1" :min="1">
        <template #prefix>R$</template>
      </n-input-number>
    </n-form-item>
  </n-form>
  <n-button @click="mountOrder()">
    Salvar
  </n-button>
  <n-layout>
    <h2>
      Saldo monetário
    </h2>
      <h3>
       USD$ {{user.dollar_balance}}.00
      </h3>
  </n-layout>
  </n-page-header>
  </div>
</template>


<script>
import axios from 'axios';
import { NPageHeader } from 'naive-ui'
import { NLayout } from 'naive-ui'
import { NForm } from 'naive-ui'
import { NFormItem } from 'naive-ui'
import { NSelect } from 'naive-ui'
import { NInputNumber } from 'naive-ui'
import { NRadio} from 'naive-ui'
import { NRadioGroup } from 'naive-ui'
import { NSpace } from 'naive-ui'
import { NButton } from 'naive-ui'
import { ref } from 'vue'


export default {
  components: {
    NPageHeader,
    NLayout,
    NForm,
    NSelect,
    NFormItem,
    NInputNumber,
    NRadio,
    NSpace,
    NRadioGroup,
    NButton
  },
  name: 'home',
  data: function () {
    return {
      claims: '',
      caffeineLevel: '',
      stockName: '',
      stocks: {},
      accessToken: '',
      user: '',
      venda: false,
      options: [{}],
      AllStockOptions: [],
      stockInfo: {},
      model: ref({
        radioGroupValue : null,
        volumeValue: null,
        priceValue: null,
        selectedValue: null
      }),
      preco: 0,
      tipo1: 1,
      tipo2: 2,
      userOrder: {
        id_user: '',
        id_stock: '',
        stock_symbol: '',
        stock_name: '',
        volume: '',
        price: '',
        type: '',
        status: '',
        remaining_volume: ''
      }
    }
  },

  created () { this.setup(), this.getUserStockBalance(), this.getUserDollarBalance() },
  methods: {
    async setup () {
      if (this.$root.authenticated) {
        this.claims = await this.$auth.getUser()
        console.log("teste para pegar id do user", this.claims)
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
      let id_user = 4;
      let idStock = 10;
      try {
          let response = await axios.get(`http://localhost:8080/api/user_stock/${id_user}/${idStock}`,
          config)
          this.stocks = response.data;
          console.log(this.stocks)
      }
      catch (error) {
        this.stocks = `${error}`
      }
    },

    clearStockInfo() {
      this.options = [{}]
    },



    async userStocksForSell(){
      this.options.label = ''
      this.options.value = ''
      this.tipo = 2
      this.venda = true
      if (this.venda){
            this.options[0].label = this.stocks.stock_name
            this.options[0].value = this.stocks.id.id_stock
      }
      this.venda = !this.venda;
      console.log(this.tipo)
    },

    async getUserDollarBalance() {
      this.accessToken = this.$auth.getAccessToken();
      const config = {
      headers: { 'Authorization': 'Bearer ' + this.accessToken }
      };
      let id_user = 4;
      try {
          let response = await axios.get(`http://localhost:8080/api/users/${id_user}`,
          config)
          this.user = response.data;
          console.log("user", this.user)
      } catch (error) {
        this.user = `${error}`
      }

    },

    async searchAllStocks() {
      this.options.label = ''
      this.options.value = ''
      this.tipo = 1
      this.accessToken = this.$auth.getAccessToken();
      const config = {
      headers: { 'Authorization': 'Bearer ' + this.accessToken }
      };
      try {
          let response = await axios.get(`http://localhost:8080/stocks/`,
          config)
          this.AllStockOptions = response.data;
          this.options = this.AllStockOptions.map((v) => ({
            label: v.stock_name,
            value: v.id,
          }));
      } catch (error) {
        this.AllStockOptions = `${error}`
      }
      console.log(this.tipo)
    },

    async findStockName(id_stock) {
      this.accessToken = this.$auth.getAccessToken();
      const config = {
      headers: { 'Authorization': 'Bearer ' + this.accessToken }
      };
      // find STOCK NAME pelo simbolo
      let response = await axios.get(`http://localhost:8080/stock-info/${id_stock}`,
      config)
      this.stockInfo = response.data
      console.log(this.stockInfo)
    },

    async mountOrder(){
     await this.findStockName(this.model.selectedValue)
     this.userOrder.id_user = 4
     this.userOrder.id_stock = this.stockInfo.id
     this.userOrder.stock_name = this.stockInfo.stock_name
     this.userOrder.stock_symbol = this.stockInfo.stock_symbol
     this.userOrder.volume = this.model.volumeValue
     this.userOrder.price = this.model.priceValue
     this.userOrder.type = this.tipo
     this.userOrder.status = 1
     this.userOrder.remaining_volume = this.model.volumeValue
     console.log(this.userOrder)
     this.saveOrder(this.userOrder) 
    },

    async saveOrder(orderInfo){
      const data = orderInfo
      this.accessToken = this.$auth.getAccessToken();
      const config = {
      headers: { 'Authorization': 'Bearer ' + this.accessToken }
      };
      try {
        let response = await axios.post('http://localhost:8080/api/new_order',
        data, config)
        return response
      } catch (error) {
        let response = `${error}`
        console.log(response)
      }  
    }
  }
}
</script>