<template>
  <div id="app">
    <div ref="playground" class="app__playground">
      <Playground class="app__playground__instance"/>
    </div>
  </div>
</template>

<script>
  import Playground from './components/Playground.vue'

  export default {
    name: 'app',
    components: {
      Playground
    },
    created() {
      window.addEventListener('resize', this.updateSize);
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.updateSize);
    },
    mounted() {
      this.updateSize();
    },
    methods: {
      updateSize() {
        this.$refs.playground.style.minHeight = `${window.innerHeight}px`;
      }
    }
  }
</script>

<style>
  body {
    position: relative;
    min-height: 100%;
    margin: 0;
    padding: 0;
    min-height: 100%;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
  }

  .app__playground {
    position: absolute;
    overflow: hidden;
    width: 100%;
    height: 100%;

    display: flex;
  }

  .app__playground__instance {
    flex: 1;
  }
</style>
