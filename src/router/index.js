import { createRouter, createWebHistory } from "vue-router";
import List from "@/views/List.vue";

const routes = [
  {
    path: "/list",
    name: "List",
    component: List,
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: { name: "List" },
  },
  // {
  //   path: "/about",
  //   name: "About",
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/About.vue"),
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
