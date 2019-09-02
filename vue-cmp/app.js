/**
 * Register Component Globally
 */
// Vue.component('my-cmp', {
//   data: function() {
//     return {
//       status: 'Critical',
//     }
//   },
//   template:
//     '<p>Server Status: {{ status }} (<button @click="changeStatus">Change</button>)</p>',
//   methods: {
//     changeStatus: function() {
//       return (this.status = 'Normal')
//     },
//   },
// })

/**
 * Register Component Locally
 */
let cmp = {
  data: function() {
    return {
      status: 'Critical',
    }
  },
  template:
    '<p>Server Status: {{ status }} (<button @click="changeStatus">Change</button>)</p>',
  methods: {
    changeStatus: function() {
      return (this.status = 'Normal')
    },
  },
}

new Vue({
  el: '#app',
  components: {
    'my-cmp': cmp,
  },
})

new Vue({
  el: '#app2',
  components: {
    'my-cmp2': cmp,
  },
})
