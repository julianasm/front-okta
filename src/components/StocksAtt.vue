<template>
  <div>
    <h1>Teste stocks</h1>
  </div>
</template>


<script>
import { fetchEventSource } from "@microsoft/fetch-event-source";

export default {
  created() {
    this.Retorno();
  },

  methods: {
    async Retorno() {
      let accessToken = this.$auth.getAccessToken();
      console.log("to entrando");
      const PauloTeste = (teste) => {
        console.log("teste",teste)
      };
      await fetchEventSource("http://localhost:8082/subscribe", {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
        onmessage(ev) {
          console.log("teste para ver se chegou")
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
  },
};
</script>
