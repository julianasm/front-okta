<template>
  <n-button-group>
    <n-button @click="activate('left')">Menu</n-button>
  </n-button-group>
  <n-drawer v-model:show="active" :width="502" :placement="placement">
    <n-drawer-content title="Stoner">
        <router-link to="/">
          Home
        </router-link>
        <router-link to="/login" v-if="!authenticated">
          Login
        </router-link>
        <router-link to="/balance">
          Balance
        </router-link>
        <router-link to="/order">
          Order
        </router-link>
        <router-link to="/profile" v-if="authenticated" >
          Profile
        </router-link>
    </n-drawer-content>
  </n-drawer>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup () {
    const active = ref(false)
    const placement = ref('right')
    const activate = (place) => {
      active.value = true
      placement.value = place
    }
    return {
      active,
      placement,
      activate
    }
  }
})
</script>