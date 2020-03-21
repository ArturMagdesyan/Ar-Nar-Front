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
              <span class="base-image" @click="imageBase(product._id, image._id, i)">
                <v-icon v-if="image.base" color='success'>mdi-checkbox-marked-circle</v-icon>
              </span>
              <span class="delete-upload-image" @click="deleteProductImage(product._id ,image._id, i)">X</span>
              <img :src="`${base_image}${image.name}`" alt="">
            </div>
          </div>
        </v-container>
      </v-card>
    </div>
</template>

<script>
import _ from 'lodash'
import { ImageAPi } from "../../../base_url/index";
import APi from '../../../api/index';
import Swal from 'sweetalert2';

export default {
  name: "productImages",
  props: {
    product: Object,
    closeImageDialog: Function
  },

  data: () => ({
    base_image: ImageAPi,
    imagesUploads: []
  }),

  computed: {},

  watch: {
    'product.images.length': function () {
      this.imagesUploads = [];
    }
  },

  methods: {
    imageBase(productId, imageId, index) {
      this.product.images.forEach((image) => {
        if (image._id === imageId) return image.base = true;
          image.base = false;
      });
      confirm("Are you sure you want to base this image?") &&
        APi.put(`/product/image/${productId}/${imageId}`).then( res => {
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
        APi.delete(`/product/image/${productId}/${imageId}`).then( res => {
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
          width: 10%;
          margin-right: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
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
