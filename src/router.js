import Vue from "vue";
import Router from "vue-router";
import Timer from "./views/Timer.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "timer",
      component: Timer
    }
  ]
});
