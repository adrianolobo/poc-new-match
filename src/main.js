import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = false;

// performs a circular shift on an array (i < 0 ? right : left)
Object.defineProperty(Array.prototype, 'rotate', {
  enumerable: false,
  value: function (i) {
    if (i == 0) return this;
    const s = (this.splice).apply(this, i < 0 ? [i] : [0, i]);
    (i < 0 ? this.unshift : this.push).apply(this, s);
    return this;
  }
});

new Vue({
  render: h => h(App),
}).$mount('#app');
