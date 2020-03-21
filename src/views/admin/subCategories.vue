<template>
  <div class="subCategories">
    <v-data-table
      :headers="headers"
      :items="subCategories"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Sub sub categories</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <!-- Add sub category modal -->
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
                  <div
                    class="div-language"
                    @click="changeLanguageLocale('hy')"
                    :class="{ active_lang: languageLocale === 'hy' }"
                  >
                    <img
                      :src="require('../../assets/admin/flags/flag_arm.png')"
                      alt=""
                    />
                  </div>
                  <div
                    class="div-language"
                    @click="changeLanguageLocale('ru')"
                    :class="{ active_lang: languageLocale === 'ru' }"
                  >
                    <img
                      :src="require('../../assets/admin/flags/flag_rus.png')"
                      alt=""
                    />
                  </div>
                  <div
                    class="div-language"
                    @click="changeLanguageLocale('en')"
                    :class="{ active_lang: languageLocale === 'en' }"
                  >
                    <img
                      :src="require('../../assets/admin/flags/flag_eng.png')"
                      alt=""
                    />
                  </div>
                </div>
              </v-card-title>
              <div></div>
              <v-card-text>
                <v-container>
                  <v-form
                    ref="formSubCategory"
                    v-model="valid"
                    lazy-validation
                  >
                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        v-model="subCategory[languageLocale].name"
                        :label="`Sub category name(${languageLocale})`"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-select
                        v-model="subCategory.categoryId"
                        :items="categories"
                        :item-text="`${languageLocale}.name`"
                        :item-value="`_id`"
                        label="Select category"
                        persistent-hint
                        single-line
                        :rules="[v => !!v || 'Category is required']"
                      ></v-select>
                    </v-col>
                  </v-row>
                  </v-form>
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
      <template v-slot:item.subCategory="{ item }">
        {{ item[$store.state.language].name }}
      </template>
      <template v-slot:item.category="{ item }">
        {{ getCategoryTableName(item.categoryId) }}
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
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import _ from "lodash";
import Api from "../../../api/index";
import Swal from "sweetalert2";
import { isValidRole } from "../../helpers/roles";
import { subCategoryHeader } from "../../helpers/dataTableHeaders";
import { languageFields } from '../../helpers/validationRequestFild'

export default {
  name: "subCategories",
  data: () => ({
    languageLocale: "hy",
    valid: true,
    dialog: false,
    headers: subCategoryHeader,
    subCategories: [],
    categories: [
      {
        _id: 1,
        hy: {
          name: "hy-1"
        },
        ru: {
          name: "ru-1"
        },
        en: {
          name: "en-1"
        }
      },
      {
        _id: 2,
        hy: {
          name: "hy-2"
        },
        ru: {
          name: "ru-2"
        },
        en: {
          name: "en-3"
        }
      },
      {
        _id: 3,
        hy: {
          name: "hy-3"
        },
        ru: {
          name: "ru-3"
        },
        en: {
          name: "en-3"
        }
      }
    ],
    editedIndex: -1,
    subCategory: {
      categoryId: null,
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
    defaultSubCategory: {
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
      return isValidRole(this.$store.state.adminUser.roles, 'CREATED');
    },
    isDeleted() {
      return isValidRole(this.$store.state.adminUser.roles, 'DELETED');
    },
    isEdited() {
      return isValidRole(this.$store.state.adminUser.roles, 'EDITED');
    },
    formTitle() {
      return this.editedIndex === -1 ? "New sub category" : "Edit sub category";
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
    Api.get(`/subCategories`).then(res => {
      this.subCategories = res;
    }).catch(err => {
      Swal.fire({
        icon: 'error',
        title: 'Get sub categories',
        text: err.message,
      })
    });
  },

  methods: {
    changeLanguageLocale(lang) {
      this.languageLocale = lang;
    },

    getCategoryTableName(id) {
      for (const category of this.categories) {
        if (category._id === id)
          return category[this.$store.state.language].name;
      }
    },

    editItem(item) {
      this.editedIndex = this.subCategories.indexOf(item);
      this.subCategory = _.cloneDeep(item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.subCategories.indexOf(item);
      confirm("Are you sure you want to delete this category?") &&
        Api.delete(`/subCategory/${item._id}`).then(res => {
          this.subCategories.splice(index, 1);
          Swal.fire({
            icon: 'success',
            title: 'Deleted sub category',
          })
        }).catch(err => {
            Swal.fire({
              icon: 'error',
              title: 'Delete sub category',
              text: err.message,
            })
        });
    },

    close() {
      this.dialog = false;
      this.$refs.formSubCategory.reset();
      setTimeout(() => {
        this.subCategory = _.cloneDeep(this.defaultSubCategory);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      if (this.editedIndex > -1) {
        // edit sub category
        this.editSubCategory();
      } else {
        // save sub category
        this.saveSubCategory();
      }
    },

    editSubCategory() {
      const error = languageFields(this.subCategory);
      if(error) {
        Swal.fire({
          icon: "error",
          title: "Edit sub category",
          text: error
        });
        return;
      }
      console.log(this.$refs.formSubCategory.validate());
      if(!this.$refs.formSubCategory.validate()) return;
      Api.put(`/subCategory/${this.subCategory._id}`, this.subCategory)
        .then(res => {
          this.subCategories.splice(this.editedIndex, 1, res);
          this.close();
          Swal.fire({
            icon: "success",
            title: "Edited sub category"
          });
        })
        .catch(err => {
          Swal.fire({
            icon: "error",
            title: "Edited sub category",
            text: err.message
          });
        });
    },

    saveSubCategory() {
      const error = languageFields(this.subCategory);
      if(error) {
        Swal.fire({
          icon: "error",
          title: "Save sub category",
          text: error
        });
        return;
      }
      if(!this.$refs.formSubCategory.validate()) return;
      Api.post(`/subCategory`, this.subCategory)
        .then(res => {
          this.subCategories.push(res);
          this.close();
          Swal.fire({
            icon: "success",
            title: "Save sub category"
          });
        })
        .catch(err => {
          Swal.fire({
            icon: "error",
            title: "Save sub category",
            text: err.message
          });
        });
    }
  }
};
</script>

<style lang="scss">
.subCategories {
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
