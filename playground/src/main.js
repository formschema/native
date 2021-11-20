import Vue from 'vue';
import VueMaterial from 'vue-material';
import Playground from './components/Playground.vue';

import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';

Vue.use(VueMaterial);

new Vue({
  render: (h) => h(Playground)
}).$mount('#app');
