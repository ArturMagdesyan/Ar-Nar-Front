<template>
  <div class="colors">
    <v-data-table
      :headers="headers"
      :items="colors"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Colors</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <!-- Add color modal -->
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn class="mx-2" fab dark color="success" v-on="on" :disabled="!isCreated">
                <v-icon dark>mdi-plus</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="justify-lg-space-between">
                <span class="headline">{{ formTitle }}</span>
                <div class="language-locale">
                  <div class="div-language" @click="changeLanguageLocale('hy')"
                       :class="{ active_lang: languageLocale === 'hy' }">
                    <img :src="require('../../assets/admin/flags/flag_arm.png')" alt="">
                  </div>
                  <div class="div-language" @click="changeLanguageLocale('ru')"
                       :class="{ active_lang: languageLocale === 'ru' }">
                    <img :src="require('../../assets/admin/flags/flag_rus.png')" alt="">
                  </div>
                  <div class="div-language" @click="changeLanguageLocale('en')"
                       :class="{ active_lang: languageLocale === 'en' }">
                    <img :src="require('../../assets/admin/flags/flag_eng.png')" alt="">
                  </div>
                </div>
              </v-card-title>
              <div>
              </div>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="color[languageLocale].name"
                        :label="`Color name(${languageLocale})`"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="save">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.name="{ item }">
        {{ item[$store.state.language].name }}
      </template>
      <template v-slot:item.action="{ item }">
        <v-btn
          class="mr-2"
          color="warning"
          fab
          small
          dark
          @click="editItem(item)"
          :disabled="!isEdited"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn color="error" fab small dark @click="deleteItem(item)" :disabled="!isDeleted">
          <v-icon >mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  import _ from "lodash"
  import Api from "../../../api/index";
  import Swal from "sweetalert2";
  import { isValidRole } from '../../helpers/roles';
  import { colorHeader } from "../../helpers/dataTableHeaders";
  import { languageFields } from '../../helpers/validationRequestFild';
  export default {
    name: "colors",
    data: () => ({
      languageLocale: 'hy',
      dialog: false,
      headers: colorHeader,
      colors: [],
      editedIndex: -1,
      color: {
        hy: {
          name: ""
        },
        ru: {
          name: ""
        },
        en: {
          name: ""
        }
      },
      defaultColor: {
        hy: {
          name: ""
        },
        ru: {
          name: ""
        },
        en: {
          name: ""
        }
      }
    }),

    computed: {
      isCreated() {
        return isValidRole(this.$store.state.adminUser.roles, 'CREATED')
      },
      isDeleted() {
        return isValidRole(this.$store.state.adminUser.roles, 'DELETED')
      },
      isEdited() {
        return isValidRole(this.$store.state.adminUser.roles, 'EDITED')
      },
      formTitle() {
        return this.editedIndex === -1 ? "New color" : "Edit color";
      }
    },

    watch: {
      dialog(val) {
        val || this.close();
      }
    },

    created() {
      Api.get(`/colors`).then(res => {
        this.colors = res;
      }).catch(err => {
        Swal.fire({
          icon: 'error',
          title: 'Get colors',
          text: err.message,
        })
      });
    },

    methods: {
      changeLanguageLocale(lang) {
        this.languageLocale = lang;
      },

      editItem(item) {
        this.editedIndex = this.colors.indexOf(item);
        this.color = _.cloneDeep(item);
        this.dialog = true;
      },

      deleteItem(item) {
        const index = this.colors.indexOf(item);
        confirm("Are you sure you want to delete this color?") &&
        Api.delete(`/color/${item._id}`).then(res => {
          this.colors.splice(index, 1);
          Swal.fire({
            icon: 'success',
            title: 'Deleted color',
          })
        }).catch(err => {
          Swal.fire({
            icon: 'error',
            title: 'Delete color',
            text: err.message,
          })
        });
      },

      close() {
        this.dialog = false;
        setTimeout(() => {
          this.color = _.cloneDeep(this.defaultColor);
          this.editedIndex = -1;
        }, 300);
      },

      save() {
        if (this.editedIndex > -1) {
          // edit color
          this.editColor();
        } else {
          // save color
          this.saveColor();
        }
      },

      editColor() {
        const error = languageFields(this.color);
        if(error) {
          Swal.fire({
            icon: "error",
            title: "Edit color",
            text: error
          });
          return;
        }
        Api.put(`/color/${this.color._id}`, this.color)
          .then(res => {
            this.colors.splice(this.editedIndex, 1, res);
            this.close();
            Swal.fire({
              icon: "success",
              title: "Edited color"
            });
          })
          .catch(err => {
            Swal.fire({
              icon: "error",
              title: "Edited color",
              text: err.message
            });
          });
      },

      saveColor() {
        const error = languageFields(this.color);
        if(error) {
          Swal.fire({
            icon: "error",
            title: "Save color",
            text: error
          });
          return;
        }
        Api.post(`/color`, this.color)
          .then(res => {
            this.colors.push(res);
            this.close();
            Swal.fire({
              icon: "success",
              title: "Save color"
            });
          })
          .catch(err => {
            Swal.fire({
              icon: "error",
              title: "Save color",
              text: err.message
            });
          });
      }
    }
  };
</script>

<style lang="scss">

  .language-locale {
    display: flex;
    justify-content: center;

    .div-language {
      width: 30px;
      height: 30px;
      display: flex;
      justify-content: center;
      cursor: pointer;
      margin-right: 10px;

      img {
        width: 100%;
      }
    }

    .active_lang {
      border: 2px solid red;
      border-radius: 50%;
    }
  }
</style>
