<template>
  <div>
    <app-stock
      v-for="stock in stocks"
      v-bind:key="stock.id"
      :stock="stock"
    ></app-stock>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Stock from "./Stock.vue";

export default {
  name: "Portfolio",
  computed: {
    ...mapGetters({
      stocks: "stockPortfolio"
    })
  },
  components: {
    appStock: Stock
  }
};
</script>

<style scoped></style>
