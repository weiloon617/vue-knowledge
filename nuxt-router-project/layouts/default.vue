<template>
  <div>
    <the-header @sidenavToggle="displaySidenav = !displaySidenav"></the-header>
    <the-sidenav
      :show="displaySidenav"
      @close="displaySidenav = false"
    ></the-sidenav>
    <nuxt />
  </div>
</template>

<script>
export default {
  data() {
    return {
      displaySidenav: false
    };
  }
};
</script>

<style>
html {
  font-family: "Open Sans", sans-serif;
}
body {
  margin: 0;
}
</style>
