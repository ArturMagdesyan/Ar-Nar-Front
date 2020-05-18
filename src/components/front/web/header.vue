<template>
  <div id="header">
    <v-container class="pa-0 top-header">
      <div class="logo">
        <img src="../../../assets/Ar&Nar.png" alt="Ar-Nar logo">
      </div>
      <div class="header-info">
        <div class="contact">
          {{ $t('header.contact.text') }}<br>
          {{ $t('header.contact.phone') }}
        </div>
        <div class="social-icons">
          <v-icon smol color="black">mdi-instagram</v-icon>
          <v-icon smol color="black">mdi-facebook</v-icon>
        </div>
        <div class="account-cart">
          <div>
            <v-icon large color="black">mdi-account</v-icon>
          </div>
          <div>
            <v-icon large color="black">mdi-cart</v-icon>
          </div>
        </div>
        <div class="lang-currency">
          <select v-model="language" @change="setLanguage()" class="lang">
            <option value="hy">HY</option>
            <option value="ru">RU</option>
          </select>
          /
          <select v-model="currency" @change="setCurrency" class="currency">
            <option value="amd">AMD</option>
            <option value="rub">RUB</option>
          </select>
        </div>
      </div>
    </v-container>
    <v-container class="nav-bar">
      <div class="women">
        {{ $t('header.links.women')}}
        <v-icon color="black">mdi-chevron-right</v-icon>
        <div class="women-links links">
          <v-container>
            <div>
              <router-link to="/c/women-times">{{ $t('header.categories.times') }}</router-link>
            </div>
            <div>
              <router-link to="/c/women-clothes">{{ $t('header.categories.clothes') }}</router-link>
            </div>
            <div>
              <router-link to="/c/women-shoes">{{ $t('header.categories.shoes') }}</router-link>
            </div>
            <div>
              <router-link to="/c/women-ornament">{{ $t('header.categories.ornament') }}</router-link>
            </div>
            <div>
              <router-link to="/c/women-phone-accessories">{{ $t('header.categories.phone-accessories') }}</router-link>
            </div>
          </v-container>
        </div>
      </div>
      <div class="men">
        {{ $t('header.links.men')}}
        <v-icon color="black">mdi-chevron-right</v-icon>
        <div class="men-links links">
          <v-container>
            <div>
              <router-link to="/c/men-times">{{ $t('header.categories.times') }}</router-link>
            </div>
            <div>
              <router-link to="/c/men-clothes">{{ $t('header.categories.clothes') }}</router-link>
            </div>
            <div>
              <router-link to="/c/men-shoes">{{ $t('header.categories.shoes') }}</router-link>
            </div>
            <div>
              <router-link to="/c/men-ornament">{{ $t('header.categories.ornament') }}</router-link>
            </div>
            <div>
              <router-link to="/c/men-phone-accessories">{{ $t('header.categories.phone-accessories') }}</router-link>
            </div>
          </v-container>
        </div>
      </div>
      <div class="kid">
        {{ $t('header.links.kid')}}
        <v-icon color="black">mdi-chevron-right</v-icon>
        <div class="kid-links links">
          <v-container>
            <div>
              <router-link to="/c/kid-times">{{ $t('header.categories.times') }}</router-link>
            </div>
            <div>
              <router-link to="/c/kid-clothes">{{ $t('header.categories.clothes') }}</router-link>
            </div>
            <div>
              <router-link to="/c/kid-shoes">{{ $t('header.categories.shoes') }}</router-link>
            </div>
            <div>
              <router-link to="/c/kid-ornament">{{ $t('header.categories.ornament') }}</router-link>
            </div>
            <div>
              <router-link to="/c/kid-phone-accessories">{{ $t('header.categories.phone-accessories') }}</router-link>
            </div>
          </v-container>
        </div>
      </div>
      <div class="wholesale">
        {{ $t('header.links.wholesale')}}
        <v-icon color="black">mdi-chevron-right</v-icon>
        <div class="wholesale-links links">
          <v-container>
            <div>{{ $t('header.categories.times') }}</div>
            <div>{{ $t('header.categories.clothes') }}</div>
            <div>{{ $t('header.categories.shoes') }}</div>
            <div>{{ $t('header.categories.ornament') }}</div>
            <div>{{ $t('header.categories.phone-accessories') }}</div>
          </v-container>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "web-header",
  data: () => ({
    language: null,
    currency: null,
  }),
  mounted() {
    this.language = this.$store.state.language;
    this.currency =this.$store.state.currency;
  },
  methods: {
    setLanguage() {
      this.$store.dispatch('setLanguage', this.language);
    },
    setCurrency() {
      this.$store.dispatch('setCurrency', this.currency);
    }
  }
}
</script>

<style scoped lang="scss">
#header {
  box-shadow: 0 10px 20px -10px #b3b3b3;
  font-family: Arial;
  .top-header {
    display: flex;
    justify-content: space-between;
    .logo {
      width: 80px;
      height: 50px;
      img {
        width: 100%;
      }
    }
    .header-info {
      display: flex;
      align-items: center;
      div {
        margin-left: 15px;
      }
      .contact {
        text-align: center;
      }
      .account-cart {
        border-left: 1px solid rgba(1, 0, 42, 0.2);
        border-right: 1px solid rgba(1, 0, 42, 0.2);
        display: flex;
        div {
          margin: 0;
          i {
            padding: 15px;
          }
        }
      }
      .social-icons {
        i{
          padding: 15px;
        }
      }
    }
  }
  .nav-bar {
    display: flex;
    justify-content: center;
    >div {
      margin: 15px;
      i {
        font-size: 16px;
      }
    }
    .links {
      display: none;
      position: absolute;
      width: 100%;
      background-color: #f1f1f1;
      top: 115px;
      left: 0;
      min-height: 80px;
      animation: all 0.5s ease;
      color: black;
      a {
        color: black;
        text-decoration: none;
      }
      a:hover {
        opacity: 0.8;
        border-bottom: 1px solid;
      }
      >div {
        >div {
         margin: 15px;
        }
        display: flex;
        justify-content: center;
        font-family: Serif;
        font-size: 14px;
      }
    }
    .women:hover {
      color: rgba(0,0,0, 0.6);
      .women-links {
        display: inline-block;
      }
      i {
        transform: rotate(90deg);
      }
    }
    .men:hover {
      color: rgba(0,0,0, 0.6);
      .men-links {
        display: inline-block;
      }
      i {
        transform: rotate(90deg);
      }
    }
    .kid:hover {
      color: rgba(0,0,0, 0.6);
      .kid-links {
        display: inline-block;
      }
      i {
        transform: rotate(90deg);
      }
    }
    .wholesale:hover {
      color: rgba(0,0,0, 0.6);
      .wholesale-links {
        display: inline-block;
      }
      i {
        transform: rotate(90deg);
      }
    }
  }
}
</style>
