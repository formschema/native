<template>
  <div id="app">
    <Playground/>
  </div>
</template>

<script>
  import Playground from './components/Playground.vue'

  export default {
    name: 'app',
    components: {
      Playground
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>
