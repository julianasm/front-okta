<template>
  <div id="home">
  <n-page-header title="Nova ordem">
  <n-form>
    <n-form-item label="Selecione o tipo de ordem" path="radioGroupValue">
      <n-radio-group v-model:value="model.radioGroupValue">
        <n-space>
          <n-radio value="Compra" @click="searchAllStocks()">Compra</n-radio>
          <n-radio value="Venda">Venda</n-radio>
        </n-space>
      </n-radio-group>
    </n-form-item>
      <n-form-item label="Selecione a ação desejada">
       <n-select
          placeholder="Select"
          :options="options"
          filterable
       />
    </n-form-item>
    <n-form-item label="Input">
      <n-input placeholder="Input" type="text"/>
    </n-form-item>
    <n-form-item label="Textarea">
      <n-input
        placeholder="Textarea"
        type="textarea"
      />
    </n-form-item>
  </n-form>
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
import { NInput } from 'naive-ui'
import { NRadio} from 'naive-ui'
import { NRadioGroup } from 'naive-ui'
import { NSpace } from 'naive-ui'

export default {
  components: {
    NPageHeader,
    NLayout,
    NForm,
    NSelect,
    NFormItem,
    NInput,
    NRadio,
    NSpace,
    NRadioGroup
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
      model: {radioGroupValue : null}
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
          console.log(this.stocks)
      }
      catch (error) {
        this.stocks = `${error}`
      }
    },

    /*async userStocksForSell(){
      this.venda = true;
      if (this.venda == true){
            this.options = this.stocks.map((v) => ({
            label: v.stock_name,
            value: v.id.id_stock,
          }));
      }
      console.log(this.options)
      this.venda = !this.venda;
    },*/

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

    },

    async searchAllStocks() {
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
            value: v.id.id_stock,
          }));
          console.log(this.options)
      } catch (error) {
        this.AllStockOptions = `${error}`
      }
    }
  }
}
</script>