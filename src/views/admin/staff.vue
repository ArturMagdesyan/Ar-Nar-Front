<template>
  <div class="staff">
    <v-data-table
      :headers="headers"
      :items="staffs"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Staff</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <!-- Add staff modal -->
          <v-dialog v-model="dialog" max-width="600px">
            <template v-slot:activator="{ on }">
              <v-btn class="mx-2" fab dark color="success" v-on="on">
                <v-icon dark>mdi-plus</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="justify-lg-space-between">
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <div>
              </div>
              <v-card-text>
                <v-container>
                  <v-form v-model="valid" ref="formStaff" lazy-validation>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        v-model="staff.firstName"
                        label="First name"
                        :rules="[v => !!v || 'First name is required']"
                      ></v-text-field>
                    </v-col>
                      <v-col cols="6">
                        <v-text-field
                          v-model="staff.lastName"
                          label="Last name"
                          :rules="[v => !!v || 'Last name is required']"
                        ></v-text-field>
                      </v-col>
                        <v-col cols="6">
                          <v-text-field
                            v-model="staff.email"
                            label="Email"
                          ></v-text-field>
                        </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="staff.phone"
                        label="Phone"
                        :rules="[v => !!v || 'Phone is required']"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-select
                        v-model="staff.roles"
                        :items="roles"
                        attach
                        chips
                        label="Roles"
                        multiple
                        :rules="[v => v.length >= 1 || 'Role is required']"
                      ></v-select>
                    </v-col>
                    <div style="width: 100%;display: flex;justify-content: center">
                      <span class="red--text">For login</span>
                    </div>
                    <v-col cols="6">
                      <v-text-field
                        v-model="staff.password"
                        label="Password"
                        :rules="[v => !!v || 'Password is required', v => v.length >= 6 || 'Password does not match 6 character']"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="staff.userName"
                        label="User name"
                        :rules="[v => !!v || 'User name is required']"
                      ></v-text-field>
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
      <template v-slot:item.name="{ item }">
        {{ item.name }}
      </template>
      <template v-slot:item.action="{ item }">
        <v-btn
          class="mr-2"
          color="warning"
          fab
          small
          dark
          @click="editItem(item)"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn color="error" fab small dark @click="deleteItem(item)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  import _ from "lodash"
  import Api from "../../../api/index";
  import Swal from "sweetalert2";

  export default {
    name: "staff",
    data: () => ({
      valid: true,
      dialog: false,
      staffs: [],
      headers: [
        {
          text: "First name",
          align: "center",
          sortable: true,
          value: `firstName`
        },
        {
          text: "Last name",
          align: "center",
          sortable: true,
          value: `lastName`
        },
        {
          text: "User name",
          align: "center",
          sortable: true,
          value: `userName`
        },
        {
          text: "Password",
          align: "center",
          sortable: false,
          value: `password`
        },
        {
          text: "Phone",
          align: "center",
          sortable: true,
          value: `phone`
        },
        {
          text: "Email",
          align: "center",
          sortable: true,
          value: `email`
        },
        {
          text: "Roles",
          align: "center",
          sortable: false,
          value: `roles`
        },
        { text: "Actions", value: "action", align: "center", sortable: false }
      ],
      roles: ['CREATED', 'UPDATED', "DELETED","ONLY_STAFF", "READ_STAFF", "ALL"],
      editedIndex: -1,
      staff: {
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
        roles: [],
        phone: "",
      },
      defaultStaff: {
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
        roles: [],
        phone: "",
      }
    }),

    computed: {
      formTitle() {
        return this.editedIndex === -1 ? "New staff" : "Edit staff";
      }
    },

    watch: {
      dialog(val) {
        val || this.close();
      }
    },

    created() {
      Api.get(`/staffs`).then(res => {
        this.staffs = res;
      }).catch(err => {
        Swal.fire({
          icon: 'error',
          title: 'Get staff',
          text: err.message,
        })
      });
    },

    methods: {

      editItem(item) {
        this.editedIndex = this.staffs.indexOf(item);
        this.staff = _.cloneDeep(item);
        this.dialog = true;
      },

      deleteItem(item) {
        const index = this.staffs.indexOf(item);
        confirm("Are you sure you want to delete this staff?") &&
        Api.delete(`/staff/${item._id}`).then(res => {
          this.staffs.splice(index, 1);
          Swal.fire({
            icon: 'success',
            title: 'Deleted staff',
          })
        }).catch(err => {
          Swal.fire({
            icon: 'error',
            title: 'Delete staff',
            text: err.message,
          })
        });
      },

      close() {
        this.dialog = false;
        setTimeout(() => {
          this.$refs.formStaff.reset();
          this.staff = _.cloneDeep(this.defaultStaff);
          this.editedIndex = -1;
        }, 300);
      },

      save() {
        if (this.editedIndex > -1) {
          // edit staff
          this.editStaff();
        } else {
          // save staff
          this.saveStaff();
        }
      },

      editStaff() {
        if (!this.$refs.formStaff.validate()) return;
        Api.put(`/staff/${this.staff._id}`, this.staff)
          .then(res => {
            this.staffs.splice(this.editedIndex, 1, res);
            this.close();
            Swal.fire({
              icon: "success",
              title: "Edited staff"
            });
          })
          .catch(err => {
            Swal.fire({
              icon: "error",
              title: "Edited staff",
              text: err.message
            });
          });
      },

      saveStaff() {
        if (!this.$refs.formStaff.validate()) return;
        Api.post(`/staff`, this.staff)
          .then(res => {
            this.staffs.push(res);
            this.close();
            Swal.fire({
              icon: "success",
              title: "Save staff"
            });
          })
          .catch(err => {
            Swal.fire({
              icon: "error",
              title: "Save staff",
              text: err.message
            });
          });
      }
    }
  };
</script>

<style lang="scss"></style>
