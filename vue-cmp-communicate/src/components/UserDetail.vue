<template>
    <div class="component">
        <h3>You may view the User Details here</h3>
        <p>Many Details</p>
        <p>User Name: {{ switchName() }}</p>
        <p>User Age: {{ userAge }}</p>
        <button @click="resetName">Reset Name</button>
        <button @click="resetFn">Reset Name</button>
    </div>
</template>

<script>
export default {
  props: {
    // name: String,
    name: {
      type: String,
      required: true,
      default: 'Max',
    },
    resetFn: {
      type: Function,
    },
    userAge: {
      type: Number,
    },
  },
  methods: {
    switchName() {
      return this.name
        .split('')
        .reverse()
        .join('')
    },
    resetName() {
      this.name = 'Wei Loon'
      this.$emit('nameWasReset', this.name)
    },
  },
}
</script>

<style scoped>
div {
  background-color: lightcoral;
}
</style>
