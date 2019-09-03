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
import { eventBus } from '../main'
export default {
  props: {
    // name: String,
    name: {
      type: String,
      required: true,
      default: 'Max',
    },
    resetFn: Function,
    userAge: Number,
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
  created: function() {
    eventBus.$on('ageWasEdited', age => {
      this.userAge = age
    })
  },
}
</script>

<style scoped>
div {
  background-color: lightcoral;
}
</style>
