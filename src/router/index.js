import Vue from 'vue';
import VueRouter from 'vue-router';
import store from "../store/index";
// front
import Home from "../views/front/home";
import Catalog from "../views/front/catalog";
// admin
import AdminHome from "../views/admin/home"
import AdminCategories from "../views/admin/categories"
import AdminProducts from "../views/admin/products"
import AdminSubCategories from "../views/admin/subCategories"
import AdminStaff from "../views/admin/staff"
import AdminColors from "../views/admin/colors"
import AdminOrder from "../views/admin/order"

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/c/:page',
    name: 'Catalog',
    component: Catalog
  },
  {
    path: '/adm',
    name: 'AdminHome',
    component: AdminHome,
    beforeEnter: (to, from, next) => {
      //if (to.path === "/adm/login") next();
      //if (!store.state.isLoggedAdmin) next('/adm/login');
      next();
    },
    children: [
      // { path: 'login', name: 'Login', component: AdminLogin },
      { path: 'categories', name: 'Categories', component: AdminCategories },
      { path: 'sub-categories', name: 'SubCategories', component: AdminSubCategories },
      { path: 'colors', name: 'colors', component: AdminColors },
      { path: 'products', name: 'Products', component: AdminProducts },
      { path: 'staff', name: 'Staff', component: AdminStaff },
      { path: 'order', name: 'Order', component: AdminOrder },
    ]
  },
  { path: '**', redirect: '/' },
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router
