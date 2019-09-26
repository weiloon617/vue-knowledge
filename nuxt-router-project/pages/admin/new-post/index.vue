<template>
  <div class="admin-new-post-page">
    <section class="new-post-form">
      <admin-post-form @submit="onSubmitted"></admin-post-form>
    </section>
  </div>
</template>

<script>
export default {
  name: "NewPost",
  layout: "admin",
  middleware: ["check-auth", "auth"],
  methods: {
    onSubmitted(postData) {
      this.$store
        .dispatch("addPost", postData)
        .then(() => this.$router.push("/admin"));
    }
  }
};
</script>

<style scoped></style>
