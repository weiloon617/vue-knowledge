<template>
  <div>
    <Header />
    <header>
      USERS SECTION
    </header>
    <nuxt />
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
export default {
  name: "users",
  components: {
    Header
  }
};
</script>

<style scoped></style>
