import Vue from "vue";
import App from "./App.vue";
import VueFormulate from '@braid/vue-formulate'
import VueGeolocation from 'vue-browser-geolocation';
import VueFormulateExtended from 'vue-formulate-extended'


Vue.use(VueFormulate, {
  plugins: [
    VueFormulateExtended({
      features: {
        formEvents: true, // by-default
      },
    }),
  ],
})

Vue.use(VueGeolocation);
Vue.config.productionTip = false;
Vue.config.devtools = true;

new Vue({
  render: h => h(App)
}).$mount("#app");
