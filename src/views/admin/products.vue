<template>
  <div class="products">
    <v-data-table
      :headers="headers"
      :items="products"
      sort-by="calories"
      class="elevation-1"
      hide-default-footer
      :items-per-page="pagination.perPage"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Product</v-toolbar-title>
          <v-row class="ml-2">
            <v-col cols="3">
              <v-select
                v-model="filter.categoryId"
                :items="categories"
                :item-text="`${$store.state.language}.name`"
                item-value="_id"
                label="Filter category"
                @change="filtered(), getFilterSubCategory()"
              ></v-select>
            </v-col>
            <v-col cols="3">
              <v-select
                v-model="filter.subCategoryId"
                :items="subCategories"
                :item-text="`${$store.state.language}.name`"
                item-value="_id"
                label="Filter sub category"
                @change="filtered()"
              ></v-select>
            </v-col>
            <v-col cols="3">
              <v-select
                v-model="filter.byOrder"
                :items="byOrder"
                item-text="name"
                item-value="id"
                label="Filter is order"
                @change="filtered()"
              ></v-select>
            </v-col>
            <v-col cols="3">
              <v-text-field
              v-model="filter.productCode"
              label="Filter product code"
              @change="filtered()"
              ></v-text-field>
            </v-col>
          </v-row>
          <div class="ml-2">
            <v-btn color="error" small @click="filterClear()">Filter clear</v-btn>
          </div>
          <v-spacer></v-spacer>
          <!-- Add sub category modal -->
          <v-dialog v-model="dialog" max-width="700px">
            <template v-slot:activator="{ on }">
              <v-btn class="mx-2" fab dark color="success" v-on="on" :disabled="!isCreated">
                <v-icon dark>mdi-plus</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-form
                ref="formProduct"
                v-model="valid"
                lazy-validation
              >
              <v-card-title class="justify-lg-space-between">
                <span class="headline">{{ formTitle }}</span>
                <v-row class="justify-center" v-if="editedIndex === -1">
                  <v-col cols="6">
                    <v-text-field
                      v-model="product.productCode"
                      label="Product code"
                      :rules="[v => !!v || 'Field is required', v => !!v && v.length >= 12 || 'Product code is not 12 character']"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="4" class="d-flex align-center">
                    <v-btn @click="productRandomCode()" small color="success">Random code</v-btn>
                  </v-col>
                </v-row>
                <v-row class="justify-center" v-else>
                  <span class="red--text">Code: {{ product.productCode }}</span>
                </v-row>
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
                  <v-row>
                    <v-col cols="12">
                      <v-btn color="error" @click="modalImages = true">
                        Images-{{ product.images.length}}
                        <span class="green--text" v-if="product.files && product.files.length">+{{ product.files.length }}</span>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model.string="product[languageLocale].name"
                        :label="`Product name(${languageLocale})`"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-textarea
                        filled
                        auto-grow
                        v-model.string="product[languageLocale].description"
                        :label="`Product description(${languageLocale})`"
                        rows="2"
                        row-height="20"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="4">
                      <v-select
                        v-model="product.genderId"
                        :items="gender"
                        :item-text="`name`"
                        :item-value="`id`"
                        label="Select gender"
                        :rules="[v => !!v || 'Gender is required']"
                      ></v-select>
                    </v-col>
                    <v-col cols="4">
                      <v-select
                        v-model="product.byOrder"
                        :items="byOrder"
                        item-text="name"
                        :item-value="`id`"
                        label="Select is order"
                        :rules="[v => !!v || 'By order is required']"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="5">
                      <v-select
                        v-model="product.categoryId"
                        :items="categories"
                        :item-text="`${languageLocale}.name`"
                        :item-value="`_id`"
                        label="Select category"
                        @change="getSubCategory(product.categoryId)"
                        :rules="[v => !!v || 'Category is required']"
                      ></v-select>
                    </v-col>
                    <v-col cols="5">
                      <v-select
                        v-model="product.subCategoryId"
                        :items="subCategories"
                        :item-text="`${languageLocale}.name`"
                        :item-value="`_id`"
                        label="Select sub category"
                        :rules="[v => !!v || 'Sub category is required']"
                      ></v-select>
                    </v-col>
                    <v-col cols="2" class="d-flex justify-center">
                      <v-switch v-model="product.onlyQuantity"></v-switch>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" v-if="product.onlyQuantity">
                      <v-container class="text-center red--text">Quantity</v-container>
                      <v-row v-for="(item, i) of product.bag" :key="i" class="bag-item" :class="{'border-bottom-none': product.bag.length - 1  === i}">
                        <v-col cols="8">
                          <v-select
                            v-model="item.colors"
                            :items="colors"
                            :item-text="`${languageLocale}.name`"
                            :item-value="`_id`"
                            label="Select color"
                            multiple
                            :rules="[v => !!v || 'Color is required']"
                          ></v-select>
                        </v-col>
                        <v-col cols="4">
                          <v-text-field
                            v-model.number="item.quantity"
                            label="Product quantity"
                            type="number"
                            :rules="[v => !!v || 'Quantity is required']"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="4" style="position: relative">
                          <span v-if="item.price && item.percentOff" style="position: absolute; width: 80%; text-align: right; color: red">{{ getPricePercentOff(item.price, item.percentOff) }}</span>
                          <v-text-field
                            v-model="item.price"
                            label="Product price(AMD)"
                            type="number"
                            :rules="[v => !!v || 'Price is required']"
                            min="10"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="4">
                          <v-text-field
                            v-model="item.percentOff"
                            label="Percent off"
                            type="number"
                            min="0"
                            max="90"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="4" class="d-flex justify-end align-center">
                          <v-btn class="mx-2" small color="error" @click="deleteRow(i)">
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                          <v-btn v-if="i === product.bag.length-1" class="mx-2" small color="success" @click="addNewRow()">
                            <v-icon>mdi-plus</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" v-if="!product.onlyQuantity">
                      <v-container class="text-center red--text">Quantity & Size</v-container>
                      <v-row v-for="(item, i) of product.bag" :key="i" class="bag-item wrap" :class="{'border-bottom-none': product.bag.length - 1  === i}">
                        <v-col cols="6">
                          <v-select
                            v-model="item.colorId"
                            :items="colors"
                            :item-text="`${languageLocale}.name`"
                            item-value="_id"
                            label="Select color"
                            :rules="[v => !!v || 'Color is required']"
                          ></v-select>
                        </v-col>
                        <v-col cols="3">
                          <v-text-field
                            v-model.number="item.quantity"
                            label="Product quantity"
                            type="number"
                            :rules="[v => !!v || 'Quantity is required']"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="3">
                          <v-text-field
                            v-model="item.size"
                            label="Product size"
                            :rules="[v => !!v || 'Size is required']"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="4">
                          <v-text-field
                            v-model="item.price"
                            label="Product price(AMD)"
                            type="number"
                            :rules="[v => !!v || 'Price is required']"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="4">
                          <v-text-field
                            v-model="item.percentOff"
                            label="Percent off"
                            type="number"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="4">
                          <v-btn class="mx-2" small color="error" @click="deleteRow(i)">
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                          <v-btn v-if="i === product.bag.length-1" class="mx-2" small color="success" @click="addNewRow()">
                            <v-icon>mdi-plus</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="save">Save</v-btn>
              </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.name="{ item }">
        {{ item[$store.state.language].name }}
      </template>
      <template v-slot:item.category="{ item }">
        {{ getCategoryTableName(item.categoryId) }}
      </template>
      <template v-slot:item.subCategory="{ item }">
        {{ getSubCategoryTableName(item.subCategoryId) }}
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
    <div class="text-center">
      <v-pagination
        v-model.number="pagination.page"
        :length="pagination.length"
      ></v-pagination>
    </div>
    <!-- images modal-->
    <v-dialog v-model="modalImages" fullscreen hide-overlay transition="dialog-bottom-transition">
      <ProductImages :colors="colors" :product="product" :closeImageDialog="closeImageDialog"></ProductImages>
    </v-dialog>
  </div>
</template>

<script>
import _ from "lodash";
import Api from "../../../api/index";
import Swal from "sweetalert2";
import { isValidRole } from "../../helpers/roles";
import { productHeader } from "../../helpers/dataTableHeaders";
import {languageFields} from "../../helpers/validationRequestFild";
import {randomCode} from '../../helpers/randomCode';
import { genders } from '../../helpers/genders';
import ProductImages from '../../components/admin/productImages';

export default {
  name: "product",
  components: {
    ProductImages
  },
  data: () => ({
    pagination: {
      perPage: 10,
      page: 1,
      length: 1
    },
    languageLocale: "hy",
    valid: true,
    modalImages: false,
    dialog: false,
    headers: productHeader,
    products: [],
    categories: [],
    subCategories: [],
    subCategoriesForTable: [],
    editedIndex: -1,
    subCategory: [],
    colors: [],
    byOrder: [
      {
      name: 'Is available',
      id: 1,
    }, {
      name: 'Only in ordering',
      id: 2,
    }
    ],
    gender: genders,
    filter: {
      productCode: '',
      categoryId: null,
      subCategoryId: null,
      byOrder: null
    },
    product: {
      productCode: '',
      categoryId: null,
      subCategoryId: null,
      byOrder: null,
      ganderId: null,
      onlyQuantity: true,
      bag: [
        {
          percentOff: null,
          price: null,
          colors: [],
          quantity: null,
          size: ''
        }
      ],
      images: [],
      files: [],
      hy: {
        name: '',
        description: '',
      },
      ru: {
        name: '',
        description: '',
      },
      en: {
        name: '',
        description: '',
      },
    },
    defaultProduct: {
      productCode: '',
      categoryId: null,
      subCategoryId: null,
      byOrder: null,
      ganderId: null,
      onlyQuantity: true,
      bag: [
        {
          percentOff: null,
          price: null,
          colors: [],
          quantity: null,
          size: ''
        }
      ],
      images: [],
      files: [],
      hy: {
        name: '',
        description: '',
      },
      ru: {
        name: '',
        description: '',
      },
      en: {
        name: '',
        description: '',
      },
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
      return this.editedIndex === -1 ? "New product" : "Edit product";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    'pagination.page': function (newPage) {
      this.getProducts();
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
        this.subCategoriesForTable = res;
        this.subCategories = res;
      }).catch(err => {
        Swal.fire({
          icon: 'error',
          title: 'Get sub categories',
          text: err.message,
        })
      });
      Api.get(`/colors`).then(res => {
        this.colors = res;
      }).catch(err => {
        Swal.fire({
          icon: 'error',
          title: 'Get colors',
          text: err.message,
        })
      });
      this.getProducts();
    },

    methods: {
      productRandomCode() {
        this.product.productCode = randomCode();
      },

      filterClear() {
        this.filter = {
          productCode: '',
          category: null,
          subCategory: null,
          byOrder: null
        };
        this.getProducts();
      },

      filtered() {
        for (const field in this.filter) {
          if (!this.filter[field]) {
            delete this.filter[field]
          }
        }
        const data = {
          filter: this.filter,
          pagination: this.pagination
        };
        Api.post(`/products-filter`, data).then(res => {
          this.pagination = res.pagination;
          this.products = res.data;
        }).catch(err => {
          Swal.fire({
            icon: 'error',
            title: 'Get sub categories',
            text: err.message,
          })
        });
      },

      closeImageDialog() {
        this.modalImages = false
      },

      addNewRow() {
        const lastItem = this.product.bag[this.product.bag.length - 1];
        if (this.product.onlyQuantity & lastItem.quantity > 0 && lastItem.colors.length > 0 && lastItem.price > 0) {
          this.product.bag.push({ quantity: null, colors: [], price: null, percentOff: null});
        }
        if (!this.product.onlyQuantity & lastItem.quantity > 0 && lastItem.colors.length > 0 && lastItem.size  && lastItem.price > 0) {
          this.product.bag.push({ quantity: null, colors: [], size: '', price: null, percentOff: null});
        }
      },

      deleteRow(index) {
        if (this.product.bag.length === 1) return;
        this.product.bag.splice(index,1);
      },

      getPricePercentOff(price, percentOff) {
        if (price && percentOff) {
          return Math.ceil(price - (price * (percentOff / 100)));
        }
      },
      // get sub category
      getSubCategory(categoryId) {
        this.product.subCategoryId = null;
        Api.get(`/subCategories/${categoryId}`).then(res => {
          this.subCategories = res;
        }).catch(err => {
          Swal.fire({
            icon: 'error',
            title: 'Get sub categories',
            text: err.message,
          })
        });
      },

      getFilterSubCategory() {
        Api.get(`/subCategories/${this.filter.categoryId}`).then(res => {
          this.subCategories = res;
        }).catch(err => {
          Swal.fire({
            icon: 'error',
            title: 'Get sub categories',
            text: err.message,
          })
        });
      },

      changeLanguageLocale(lang) {
        this.languageLocale = lang;
      },

      getCategoryTableName(id) {
        for (const category of this.categories) {
          if (category._id === id)
            return category[this.$store.state.language].name;
        }
      },

      getSubCategoryTableName(id) {
        for (const subCategory of this.subCategoriesForTable) {
          if (subCategory._id === id)
            return subCategory[this.$store.state.language].name;
        }
      },

      editItem(item) {
        item.files = [];
        this.editedIndex = this.products.indexOf(item);
        this.product = _.cloneDeep(item);
        this.dialog = true;
      },

      deleteItem(item) {
        const index = this.products.indexOf(item);
        confirm("Are you sure you want to delete this category?") &&
        Api.delete(`/product/${item._id}`).then(res => {
          this.products.splice(index, 1);
          Swal.fire({
            icon: 'success',
            title: 'Deleted product',
          })
        }).catch(err => {
          Swal.fire({
            icon: 'error',
            title: 'Delete product',
            text: err.message,
          })
        });
      },

      close() {
        this.dialog = false;
        setTimeout(() => {
          this.$refs.formProduct.reset();
          this.editedIndex = -1;
          this.product = _.cloneDeep(this.defaultProduct);
        }, 300);
      },

      save() {
        if (this.editedIndex > -1) {
          // edit sub category
          this.editProduct();
        } else {
          // save sub category
          this.saveProduct();
        }
      },

      getProducts() {
        Api.get(`/products?page=${this.pagination.page}&perPage=${this.pagination.perPage}`).then(res => {
          this.pagination = res.pagination;
          this.products = res.data;
        }).catch(err => {
          Swal.fire({
            icon: 'error',
            title: 'Get sub categories',
            text: err.message,
          })
        });
      },

      editProduct() {
        const error = languageFields(this.product);
        if(error) {
          Swal.fire({
            icon: "error",
            title: "Edit product",
            text: error
          });
          return;
        }
        if (!this.$refs.formProduct.validate()) return;
        const formData = new FormData();
        if (this.product.files.length) {
          for (const file of this.product.files) {
            formData.append('files', file, file.name);
          }
          formData.append('body', JSON.stringify(this.product));
        } else {
          formData.append('body', JSON.stringify(this.product));
          delete this.product.files
        }
        Api.put(`/product/${this.product._id}`, formData)
          .then(res => {
            this.products.splice(this.editedIndex, 1, res);
            this.close();
            Swal.fire({
              icon: "success",
              title: "Edited product"
            });
          })
          .catch(err => {
            Swal.fire({
              icon: "error",
              title: "Edited product",
              text: err.message
            });
          });
      },

      saveProduct() {
        const error = languageFields(this.product);
        if(error) {
          Swal.fire({
            icon: "error",
            title: "Save product",
            text: error
          });
          return;
        }
        if (!this.$refs.formProduct.validate()) return;
        const formData = new FormData();
        if (this.product.files.length) {
          for (const file of this.product.files) {
            formData.append('files', file, file.name);
          }
          formData.append('body', JSON.stringify(this.product));
        } else {
          formData.append('body', JSON.stringify(this.product));
          delete this.product.files
        }
        Api.post(`/product`, formData)
          .then(res => {
            this.products.push(res);
            this.close();
            Swal.fire({
              icon: "success",
              title: "Save product"
            });
          })
          .catch(err => {
            Swal.fire({
              icon: "error",
              title: "Save product",
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
  .bag-item {
    border-bottom: 1px dashed red !important;
  }
  .border-bottom-none {
    border-bottom: none !important;
  }
</style>
