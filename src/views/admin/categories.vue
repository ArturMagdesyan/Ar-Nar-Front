<template>
  <div class="categories">
    <v-data-table
      :headers="headers"
      :items="categories"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Categories</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <!-- Add category modal -->
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
                        v-model="category[languageLocale].name"
                        :label="`Category name(${languageLocale})`"
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
  import { categoryHeader } from "../../helpers/dataTableHeaders";
  import { languageFields } from '../../helpers/validationRequestFild';
  export default {
    name: "categories",
    data: () => ({
      languageLocale: 'hy',
      dialog: false,
      headers: categoryHeader,
      categories: [],
      editedIndex: -1,
      category: {
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
      defaultCategory: {
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
        return this.editedIndex === -1 ? "New category" : "Edit category";
      }
    },

    watch: {
      dialog(val) {
        val || this.close();
      }
    },

    created() {
      Api.get(`/categories`).then(res => {
        this.categories = res;
      }).catch(err => {
        Swal.fire({
          icon: 'error',
          title: 'Get categories',
          text: err.message,
        })
      });
    },

    methods: {
      changeLanguageLocale(lang) {
        this.languageLocale = lang;
      },

      editItem(item) {
        this.editedIndex = this.categories.indexOf(item);
        this.category = _.cloneDeep(item);
        this.dialog = true;
      },

      deleteItem(item) {
        const index = this.categories.indexOf(item);
        confirm("Are you sure you want to delete this category?") &&
          Api.delete(`/category/${item._id}`).then(res => {
            this.categories.splice(index, 1);
            Swal.fire({
              icon: 'success',
              title: 'Deleted category',
            })
          }).catch(err => {
              Swal.fire({
                icon: 'error',
                title: 'Delete category',
                text: err.message,
              })
          });
      },

      close() {
        this.dialog = false;
        setTimeout(() => {
          this.category = _.cloneDeep(this.defaultCategory);
          this.editedIndex = -1;
        }, 300);
      },

      save() {
        if (this.editedIndex > -1) {
          // edit category
          this.editCategory();
        } else {
          // save category
          this.saveCategory();
        }
      },

      editCategory() {
        const error = languageFields(this.category);
        if(error) {
          Swal.fire({
            icon: "error",
            title: "Edited category",
            text: error
          });
          return;
        }
        Api.put(`/category/${this.category._id}`, this.category)
          .then(res => {
            this.categories.splice(this.editedIndex, 1, res);
            this.close();
            Swal.fire({
              icon: "success",
              title: "Edited category"
            });
          })
          .catch(err => {
            Swal.fire({
              icon: "error",
              title: "Edited category",
              text: err.message
            });
          });
      },

      saveCategory() {
        const error = languageFields(this.category);
        if(error) {
          Swal.fire({
            icon: "error",
            title: "Save category",
            text: error
          });
          return;
        }
        Api.post(`/category`, this.category)
          .then(res => {
            this.categories.push(res);
            this.close();
            Swal.fire({
              icon: "success",
              title: "Save category"
            });
          })
          .catch(err => {
            Swal.fire({
              icon: "error",
              title: "Save category",
              text: err.message
            });
          });
      }
    }
  };
</script>

<style lang="scss">
  .categories {
  }

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
