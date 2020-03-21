<template>
  <div id="topBar">
    <v-row class="p-0 m-0 div-row">
      <v-col cols="2" class="d-flex justify-center p-0">
        <div class="logo">
          <img src="../../assets/Ar&Nar.png" alt="Logo">
        </div>
      </v-col>
      <v-col cols="8" class="d-flex justify-lg-end p-0 ">
        <div class="div-language" @click="changeLanguage('hy')" :class="{ active_lang: $store.state.language === 'hy' }">
          <img :src="require('../../assets/admin/flags/flag_arm.png')" alt="">
        </div>
        <div class="div-language" @click="changeLanguage('ru')" :class="{ active_lang: $store.state.language === 'ru' }">
          <img :src="require('../../assets/admin/flags/flag_rus.png')" alt="">
        </div>
        <div class="div-language" @click="changeLanguage('en')" :class="{ active_lang: $store.state.language === 'en' }">
          <img :src="require('../../assets/admin/flags/flag_eng.png')" alt="">
        </div>
      </v-col>
      <v-col cols="2" class="p-0 d-flex justify-center">
        <v-btn small color="red" dark @click="logout()">
          Logout
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "topBar",
  data: () => ({
  }),
  methods: {
    changeLanguage(lang) {
      this.$store.dispatch('setLanguage', lang);
    },
    logout() {
      this.$store.dispatch('logout')
    }
  }
};
</script>

<style scoped lang="scss">
  #topBar {
    height: 60px;
    background: #f1f1f1;
    .div-row {
      height: 100%;
      align-items: center;
      div {
        padding: 0 !important;
      }
    }
    .div-language {
      cursor: pointer;
      margin: 5px;
      width: 40px;
      height: 40px;
      border: 1px solid;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-size: 100%;
      img {
        width: 100%;
      }
    }
    .active_lang {
      border: 2px solid red;
    }
    .logo {
      width: 70px;
      height: 60px;
      display: flex;
      justify-content: center;
      img {
        width: 100%;
      }
    }
  }
</style>
