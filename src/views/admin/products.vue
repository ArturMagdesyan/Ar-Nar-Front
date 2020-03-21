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
            <v-col cols="4">
              <v-select
                v-model="filter.categoryId"
                :items="categories"
                :item-text="`${$store.state.language}.name`"
                item-value="_id"
                label="Filter category"
                @change="filtered(), getFilterSubCategory()"
              ></v-select>
            </v-col>
            <v-col cols="4">
              <v-select
                v-model="filter.subCategoryId"
                :items="subCategories"
                :item-text="`${$store.state.language}.name`"
                item-value="_id"
                label="Filter sub category"
                @change="filtered()"
              ></v-select>
            </v-col>
            <v-col cols="4">
              <v-select
                v-model="filter.byOrder"
                :items="byOrder"
                item-text="name"
                item-value="id"
                label="Filter is Order"
                @change="filtered()"
              ></v-select>
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
                <v-row class="justify-center">
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
                    <v-col cols="8">
                      <v-text-field
                        v-model.string="product[languageLocale].name"
                        :label="`Product name(${languageLocale})`"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="4">
                      <v-select
                        v-model="product.color"
                        :items="colors"
                        :item-text="`${languageLocale}.name`"
                        item-value="_id"
                        label="Select color"
                        multiple
                        :rules="[v => (v && v.length >= 1) || 'Color is required']"
                      ></v-select>
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
                    <v-col cols="6">
                      <v-select
                        v-model="product.categoryId"
                        :items="categories"
                        :item-text="`${languageLocale}.name`"
                        :item-value="`_id`"
                        label="Select category"
                        @change="getSubCategory(product.categoryId)"
                        persistent-hint
                        single-line
                        :rules="[v => !!v || 'Category is required']"
                      ></v-select>
                    </v-col>
                    <v-col cols="6">
                      <v-select
                        v-model="product.subCategoryId"
                        :items="subCategories"
                        :item-text="`${languageLocale}.name`"
                        :item-value="`_id`"
                        label="Select sub category"
                        persistent-hint
                        single-line
                        :rules="[v => !!v || 'Sub category is required']"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6">
                      <v-select
                        v-model="product.byOrder"
                        :items="byOrder"
                        item-text="name"
                        item-value="id"
                        label="Select is order"
                        persistent-hint
                        single-line
                      ></v-select>
                    </v-col>
                    <v-col cols="4" style="position: relative">
                      <span v-if="product.price && product.percentOff" style="position: absolute; width: 80%; text-align: right; color: red">{{ getPricePercentOff() }}</span>
                      <v-text-field
                        v-model="product.price"
                        label="Product price(AMD)"
                        type="number"
                        :rules="[v => !!v || 'Price is required']"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="2">
                      <v-text-field
                        v-model="product.percentOff"
                        label="Percent off"
                        type="number"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row v-if="product.byOrder == 1">
                    <v-col cols="3">
                      <span v-if="product.onlyQuantity">Quantity</span>
                      <span v-else>Quantity and size</span>
                      <v-switch v-model="product.onlyQuantity"></v-switch>
                    </v-col>
                    <v-col cols="9">
                      <v-text-field
                        v-if="product.onlyQuantity"
                        v-model="product.quantity"
                        label="Product quantity"
                        type="number"
                        :rules="[v => !!v || 'Quantity is required']"
                      ></v-text-field>
                      <div v-else class="quantitySize">
                        <v-row v-for="(quantitySize, i) of product.quantitySize" :key="i">
                          <v-col cols="5">
                            <v-text-field
                              v-model.number="quantitySize.quantity"
                              label="Product quantity"
                              type="number"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="5">
                            <v-text-field
                              v-model="quantitySize.size"
                              label="Product size"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="2">
                              <v-btn class="mx-2" small color="error" @click="deleteRow(i)">
                                <v-icon>mdi-delete</v-icon>
                              </v-btn>
                            <v-btn v-if="i === product.quantitySize.length-1" class="mx-2" small color="success" @click="addNewRow()">
                              <v-icon>mdi-plus</v-icon>
                            </v-btn>
                          </v-col>
                        </v-row>
                      </div>
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
      <ProductImages :product="product" :closeImageDialog="closeImageDialog"></ProductImages>
    </v-dialog>
  </div>
</template>

<script>
import _ from "lodash";
import Api from "../../../api/index";
import Swal from "sweetalert2";
import { isValidRole } from "../../helpers/roles";
import { productHeader } from "../../helpers/dataTableHeaders";
import ProductImages from '../../components/admin/productImages';
import {languageFields,validateQuantityAndSize} from "../../helpers/validationRequestFild";
import {randomCode} from '../../helpers/randomCode';

export default {
  name: "product",
  components: {
    ProductImages
  },
  data: () => ({
    pagination: {
      perPage: 5,
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
    subCategoriesTable: [],
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
    filter: {
      categoryId: null,
      subCategoryId: null,
      byOrder: null
    },
    product: {
      productCode: '',
      categoryId: null,
      subCategoryId: null,
      byOrder: 1,
      price: null,
      percentOff: null,
      onlyQuantity: true,
      quantity: null,
      quantitySize: [{ quantity: null, size: ''}],
      images: [],
      files: [],
      color: [],
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
      byOrder: 1,
      price: null,
      percentOff: null,
      onlyQuantity: true,
      quantity: null,
      quantitySize: [{ quantity: null, size: ''}],
      images: [],
      files: [],
      color: [],
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
        this.subCategoriesTable = res;
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
        const quantitySize = this.product.quantitySize[this.product.quantitySize.length - 1];
        if (quantitySize.quantity && quantitySize.size) {
          this.product.quantitySize.push({ quantity: null, size: ''})
        }
      },

      deleteRow(index) {
        if (this.product.quantitySize.length === 1) return
        this.product.quantitySize.splice(index,1);
      },

      getPricePercentOff() {
        if (this.product.price && this.product.percentOff) {
          return Math.ceil(this.product.price - (this.product.price * (this.product.percentOff / 100)));
        }
      },
      // get sub category
      getSubCategory(categoryId) {
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
        for (const subCategory of this.subCategoriesTable) {
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
        if (!this.product.onlyQuantity && this.product.byOrder == 1) {
          const err = validateQuantityAndSize(this.product.quantitySize);
          if(err) {
            Swal.fire({
              icon: "error",
              title: "Edit product",
              text: err
            });
            return;
          }
        }
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
        if (!this.product.onlyQuantity && this.product.byOrder == 1) {
          const err = validateQuantityAndSize(this.product.quantitySize);
          if(err) {
            Swal.fire({
              icon: "error",
              title: "Edit product",
              text: err
            });
            return;
          }
        }
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
</style>
