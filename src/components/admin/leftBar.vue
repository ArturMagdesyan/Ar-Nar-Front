<template>
  <v-card id="leftBAr">
    <v-navigation-drawer v-model="drawer" :mini-variant.sync="mini" permanent>
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <img style="width: 40px; height: 40px;" src="../../assets/admin/user.png" alt="">
        </v-list-item-avatar>

        <v-list-item-title>{{
          $store.state.adminUser.firstName
        }} {{
          $store.state.adminUser.lastName
          }}</v-list-item-title>

        <v-btn icon @click.stop="mini = !mini">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item
          v-for="link in barLinks"
          :key="link.title"
          link
          :to="link.path"
        >
          <v-list-item-icon>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ link.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- Staff -->
        <v-list-item
          link
          to="/adm/staff"
          v-if="isReadStaff"
        >
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Staff</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- Order -->
        <v-list-item
          link
          to="/adm/order"
        >
          <v-list-item-icon>
            <v-icon>mdi-shopping</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Order</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
import {isValidRole} from "../../helpers/roles";

export default {
  name: "leftBar",
  data() {
    return {
      drawer: true,
      barLinks: [
        { title: "Home", icon: "mdi-home", path: "/adm" },
        {
          title: "Categories",
          icon: "mdi-arrow-right",
          path: "/adm/categories"
        },
        {
          title: "Sub categories",
          icon: "mdi-arrow-right",
          path: "/adm/sub-categories"
        },
        {
          title: "Colors",
          icon: "mdi-format-color-fill",
          path: "/adm/colors"
        },
        { title: "Products", icon: "mdi-database", path: "/adm/products" },
      ],
      mini: true
    };
  },

  computed: {
    isReadStaff() {
      return isValidRole(this.$store.state.adminUser.roles, 'READ_STAFF')
    },
  }

};
</script>

<style scoped>
#leftBAr {
  height: calc(100vh - 60px);
  display: inline-block;
  float: left;
  margin-right: 10px;
}
</style>
