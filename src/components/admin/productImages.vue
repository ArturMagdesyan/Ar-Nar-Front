<template>
    <div class="productImages">
      <v-card style="height: 100vh">
        <v-toolbar dark color="#7a8288">
          <v-toolbar-title>Products image(s)</v-toolbar-title>
          <v-spacer class="ml-5">
            <span v-if="product.images">Products images - {{product.images.length}}</span>
            <span v-if="product.files" class="ml-2">Products images for uploads - {{product.files.length}}</span>
          </v-spacer>
          <v-toolbar-items class="mr-1">
            <v-btn color="success" class="add-image" @click="clickFileInput()">
              <v-icon>mdi-cloud-upload</v-icon>
              <input id="imageUpload" class="input-file" @change="viewImages($event)" type="file" accept=".png, .jpg, .jpeg"  multiple/>
            </v-btn>
          </v-toolbar-items>
          <v-toolbar-items class="mr-1">
            <v-btn color="error" dark @click="deletedAllUploads()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar-items>
          <v-toolbar-items>
            <v-btn color="warning" dark @click="closeImageDialog()">
              <v-icon>mdi-checkbox-marked-circle</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container class="images-container">
          <div class="upload-container" v-if="imagesUploads.length">
            <h4 class="title">Upload images</h4>
            <div class="view-image" v-for="(image, i) of imagesUploads" :key="i">
              <span class="delete-upload-image" @click="deleteUploadImage(i)">X</span>
              <img :src="image" alt="">
            </div>
          </div>
          <div class="upload-container" v-if="product.images.length">
            <h4 class="title">Product images</h4>
            <div class="view-image" v-for="(image, i) of product.images" :key="i">
              <div>
                <span class="base-image" @click="imageBase(product._id, image._id, image.bagItemId)">
                  <v-icon v-if="image.base" color='success'>mdi-checkbox-marked-circle</v-icon>
                </span>
                <span class="delete-upload-image" @click="deleteProductImage(product._id ,image._id, i)">X</span>
                <img :src="`${base_image}${image.name}`" alt="">
              </div>
              <div>
                <v-select
                  v-model="image.bagItemId"
                  @change="setImageColor(product._id, image._id, image.bagItemId)"
                  :items="imagesColors"
                  :item-text="`.name`"
                  item-value="_id"
                  label="Select color"
                ></v-select>
              </div>
            </div>
          </div>
        </v-container>
      </v-card>
    </div>
</template>

<script>
import _ from 'lodash'
import { ImageAPi } from "../../../base_url/index";
import API from '../../../api/index';
import Swal from 'sweetalert2';
import { getImagesColors } from '../../helpers/imagesColors';

export default {
  name: "productImages",
  props: {
    product: Object,
    closeImageDialog: Function,
    colors: Array
  },

  data: () => ({
    base_image: ImageAPi,
    imagesUploads: [],
    imagesColors: [],
  }),

  created() {
    this.imagesColors = getImagesColors(this.product.bag, this.colors, this.$store.state.language);
  },

  watch: {
    'product.images.length': function () {
      this.imagesUploads = [];
    },
    'product._id': function () {
      if(_.get(this.product, '_id')) {
        this.imagesColors = getImagesColors(this.product.bag, this.colors, this.$store.state.language);
      }

    }
  },

  methods: {
    setImageColor(productId, imageId, bagItemId) {
      API.put(`/product/image-color/${productId}/${imageId}/${bagItemId}`).then(res => {
        Swal.fire({
          icon: 'success',
          title: 'Product image color',
        })
      }).catch(err => {
        Swal.fire({
          icon: 'error',
          title: 'Product image color',
          text: err.message,
        })
      })
    },

    imageBase(productId, imageId, bagItemId) {
      if (_.isNil(bagItemId)) {
        Swal.fire({
          icon: 'error',
          title: 'Select image color',
        });
        return;
      };
      confirm("Are you sure you want to base this image?") &&
      API.put(`/product/image-base/${productId}/${imageId}/${bagItemId}`).then( res => {
        this.product.images = _.get(res,'data.images');
          Swal.fire({
            icon: 'success',
            title: 'Base image',
          })
        }).catch(err => {
          Swal.fire({
            icon: 'error',
            title: 'Base image',
            text: err.message,
          })
        })
    },

    deleteProductImage(productId, imageId, index) {
      confirm("Are you sure you want to delete this image?") &&
      API.delete(`/product/image-delete/${productId}/${imageId}`).then( res => {
          this.product.images.splice(index, 1);
          Swal.fire({
            icon: 'success',
            title: 'Deleted image',
          })
        }).catch( err => {
          Swal.fire({
            icon: 'error',
            title: 'Delete image',
            text: err.message,
          })
      })
    },

    deletedAllUploads() {
      this.product.files = [];
      this.imagesUploads = [];
      this.closeImageDialog();
    },

    deleteUploadImage(index) {
      this.product.files.splice(index,1);
      this.imagesUploads.splice(index,1);
    },

    clickFileInput(){
      document.getElementById('imageUpload').click();
    },

    viewImages(e) {
      const inputFiles = document.getElementById("imageUpload");
      for (let i = 0; i <= inputFiles.files.length - 1; i++) {
        this.product.files.push(inputFiles.files[i]);
        let reader = new FileReader();
        reader.onload = (e) => {
          this.imagesUploads.push(e.target.result);
        };
        reader.readAsDataURL(inputFiles.files[i]);
      }
    }

  },
}
</script>

<style scoped lang="scss">
  .productImages {
    .add-image {
      position: relative;
      .input-file{
        display: none;
      }
    }
    .images-container {
      background-color: #f1f1f1;
      min-height: calc(100% - 64px);
      .upload-container {
        width: 100%;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        .title {
          width: 100%;
          color: red;
          text-align: center;
          margin-bottom: 15px;
        }
        .view-image {
          width: 17%;
          margin-right: 10px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: flex-end;
          position: relative;
          .delete-upload-image {
            position: absolute;
            display: flex;
            justify-content: center;
            width: 22px;
            color: white;
            border: 1px solid red;
            height: 22px;
            align-items: center;
            background-color: red;
            border-radius: 50%;
            cursor: pointer;
            right: 0;
            top: 0;
          }
          img {
            width: 100%;
          }
          .base-image {
            position: absolute;
            display: flex;
            justify-content: center;
            width: 22px;
            color: white;
            border: 1px solid #00800078;
            height: 22px;
            align-items: center;
            cursor: pointer;
            left: 0;
            top: 0;
            background-color: #f5f5dc9e;
          }
        }
      }
    }
  }
</style>
