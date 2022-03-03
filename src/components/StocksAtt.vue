<template>
  <div>
    <h1>Teste stocks</h1>
  </div>
</template>


<script>
import { fetchEventSource } from "@microsoft/fetch-event-source";

export default {
  created() {
    this.stockEventSource();
  },

  methods: {
    async stockEventSource() {
      let accessToken = this.$auth.getAccessToken();
      console.log("chegou no await");
      const PauloTeste = (teste) => {
        console.log(teste)
      };
      await fetchEventSource("http://localhost:8082/subscribe", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        onmessage(ev) {
          PauloTeste(JSON.parse(ev.data));
        },
        onerror(e){
             if (e) {
            console.log("Sou do erro", e);
            throw e; 
        }
      }})
    }
    }
};
</script>
