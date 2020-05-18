<template>
    <div id="footer">
      <v-container>
        <v-row>
          <v-col cols="2">
            <h3 class="footer-title">{{ $t('footer.shopping.name')}}</h3>
            <ul>
              <li>
                <router-link to="">{{ $t('footer.shopping.women')}}</router-link>
              </li>
              <li>
                <router-link to="">{{ $t('footer.shopping.men')}}</router-link>
              </li>
              <li>
                <router-link to="">{{ $t('footer.shopping.kid')}}</router-link>
              </li>
              <li>
                <router-link to="">{{ $t('footer.shopping.wholesale')}}</router-link>
              </li>
            </ul>
          </v-col>
          <v-col cols="3">
            <h3 class="footer-title">{{ $t('footer.customer-service.name')}}</h3>
            <ul>
              <li>
                <router-link to="">{{ $t('footer.customer-service.forgot-password')}}</router-link>
              </li>
              <li>
                <router-link to="">{{ $t('footer.customer-service.security-policy')}}</router-link>
              </li>
              <li>
                <router-link to="">{{ $t('footer.customer-service.faqs')}}</router-link>
              </li>
              <li>
                <router-link to="">{{ $t('footer.customer-service.contact-info')}}</router-link>
              </li>
            </ul>
          </v-col>
          <v-col cols="3">
            <h3 class="footer-title">{{ $t('footer.my-account.name')}}</h3>
            <ul>
              <li>
                <router-link to="">{{ $t('footer.my-account.login-register')}}</router-link>
              </li>
              <li>
                <router-link to="">{{ $t('footer.my-account.my-account')}}</router-link>
              </li>
              <li>
                <router-link to="">{{ $t('footer.my-account.order-status')}}</router-link>
              </li>
              <li>
                <router-link to="">{{ $t('footer.my-account.order-history')}}</router-link>
              </li>
              <li>
                <router-link to="">{{ $t('footer.my-account.track-my-order')}}</router-link>
              </li>
            </ul>
          </v-col>
          <v-col cols="3">
            <h3 class="footer-title">{{ $t('footer.information.name')}}</h3>
            <ul>
              <li>
                <router-link to="">{{ $t('footer.information.about')}}</router-link>
              </li>
              <li>
                <router-link to="">{{ $t('footer.information.site-map')}}</router-link>
              </li>
              <li>
                {{ $t('footer.information.find-us-on')}}
              </li>
              <li class="icons">
                <a href="https://www.facebook.com/arnar.online.shop/"><v-icon smol color="grey">mdi-facebook</v-icon></a>
                <a href=""><v-icon smol color="grey">mdi-instagram</v-icon></a>
              </li>
            </ul>
          </v-col>
          <v-col cols="1" class="to-top">
            <div @click="goToTop()">
              <v-icon color="grey">mdi-arrow-up</v-icon>
            </div>
          </v-col>
        </v-row>
      </v-container>
      <v-container class="d-flex justify-center">
        <img src="../../../assets/front/footer/payment-metods-icons.png" alt="Ar-Nar payment icons">
      </v-container>
      <v-container class="copyright">
        Copyright © 2019 "Ar-Nar Online Shop". All Rights Reserved
      </v-container>
    </div>
</template>

<script>
export default {
  name: "web-footer",
  methods: {
    goToTop() {
      window.scrollTo(0,0);
    }
  }
}
</script>

<style scoped lang="scss">
#footer {
  width: 100%;
  background: #f1f1f1;
  font-family: serif;
  box-shadow: 0 -10px 20px -10px #b3b3b3;
  position: relative;
  .footer-title {
    font-family: "Roboto", sans-serif;
    margin-bottom: 10px;
  }
  ul {
    padding: 0;
    list-style: none;
    li {
      margin-bottom: 5px;
    }
    a {
      text-decoration: none;
      color: black;
    }
    a:hover {
      border-bottom: 1px solid;
    }
  }
  .icons {
    a {
      border: none !important;
      margin-right: 10px;
    }
  }
  .to-top {
    display: flex;
    justify-content: center;
    align-items: center;
    >div {
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 60px;
      height: 60px;
      border: 2px solid grey;
      border-radius: 50%;
      i {
        font-size: 27px;
      }
    }

  }
  .copyright {
    text-align: center;
    font-size: 13px;
    font-weight: 100;
    font-family: initial;
  }
}
</style>
