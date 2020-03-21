<template>
  <!-- Login admin or Admin home -->
  <div>
    <div v-if="!$store.state.isLoggedAdmin">
      <Login></Login>
    </div>
    <div v-else>
      <TopBar></TopBar>
      <LeftBar></LeftBar>
      <div style="padding: 10px; display: grid">
        <div v-if="$route.path === '/adm'">
          Hello My friend
        </div>
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import TopBar from "../../components/admin/topBar";
import LeftBar from "../../components/admin/leftBar";
import Login from "../../components/admin/login";

export default {
  name: "home",
  components: {
    TopBar,
    LeftBar,
    Login
  }
};
</script>

<style scoped lang="scss"></style>
