<template>
  <div id="app">
    <el-row :gutter="20">
      <el-col :span="16">
        <h1>Product List</h1>
        <product-list></product-list>
      </el-col>
      <el-col :span="8">
        <h1>Shopping Cart</h1>
        <shopping-cart></shopping-cart>
        <p>
          <b>Total Cost: {{ totalCost | currency }}</b>
        </p>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ShoppingCart from "./components/ShoppingCart.vue";
import ProductList from "./components/ProductList.vue";
import { Store } from "./store/store";

export default {
  name: "app",
  components: {
    shoppingCart: ShoppingCart,
    productList: ProductList
  },
  computed: {
    totalCost() {
      return Store.totalCost;
    }
  }
};
</script>

<style></style>
