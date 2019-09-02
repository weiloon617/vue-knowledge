<template>
  <div>
    <app-server-status v-for="(server, index) in 5" v-bind:key="index"></app-server-status>
  </div>
</template>

<script>
import ServerStatus from "./ServerStatus.vue";
export default {
  components: {
    "app-server-status": ServerStatus
  }
};
</script>