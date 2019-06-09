<template>
  <div id="app">
    <div class="app__playground">
      <Playground/>
    </div>
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
  body {
    position: relative;
    min-height: 100%;
    margin: 0;
    padding: 0;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    color: #2c3e50;
  }
</style>
