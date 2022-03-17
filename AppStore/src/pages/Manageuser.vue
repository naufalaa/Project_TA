<template>
  <q-page>
    <q-toolbar class="q-pl-md q-pr-md bgtitle">
      <q-icon name="manage_accounts" size="sm" />
      <q-toolbar-title>
        <span class="text-primary">PENGATURAN</span> USER
      </q-toolbar-title>
      <q-space />
      <q-input dense debounce="300" v-model="filter" input-class="text-uppercase" maxlength="20">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-btn-group flat class="q-ml-sm">
        <q-btn flat dense color="primary" icon="add" :loading="loading" @click="dispInsert()">
          <q-tooltip anchor="bottom middle" self="top end">TAMBAH USER CO2 APP</q-tooltip>
        </q-btn>
      </q-btn-group>
    </q-toolbar>
    <q-separator />
    <q-scroll-area style="height: calc(100vh - 136px);">
      <div class="q-pa-md">
        <q-card flat square bordered class="q-pa-none" style="min-height: calc(100vh - 170px);">
          <q-card-section>
            <q-table
              flat
              :data="dataUserSecure"
              :columns="columns"
              row-key="id"
              :pagination.sync="pagination"
              :rows-per-page-options="[50]"
              :filter="filter"
              rows-per-page-label="DATA PER HALAMAN:"
              hide-no-data
              separator="none"
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="id" :props="props" auto-width>{{ props.row.id }}</q-td>
                  <q-td key="name" :props="props">{{ props.row.name }}</q-td>
                  <q-td key="userfield" :props="props">{{ props.row.userfield }}</q-td>
                  <q-td key="idcoa" :props="props" auto-width>{{ props.row.idcoa }}</q-td>
                  <q-td key="accname" :props="props">{{ props.row.accname }}</q-td>
                  <q-td key="lastsign" :props="props">{{ formatDateTime(props.row.lastsign) }}</q-td>
                  <q-td key="actions" :props="props" auto-width>
                    <q-btn-group flat>
                      <q-btn
                        dense
                        unelevated
                        text-color="info"
                        icon="crop_din"
                        @click="dispUpdate(props.row)"
                      >
                        <q-tooltip anchor="bottom middle" self="top end">UPDATE {{ props.row.name }}</q-tooltip>
                      </q-btn>
                    </q-btn-group>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </q-scroll-area>

    <q-dialog v-model="windInsert" persistent transition-show="none" transition-hide="none">
      <q-card class="q-pa-none" style="width:620px; min-height: calc(100vh - 240px);">
        <q-toolbar>
          <q-icon name="add" class="text-primary" size="sm" />
          <q-toolbar-title>USER</q-toolbar-title>
          <q-input
            dense
            debounce="300"
            v-model="filteradd"
            input-class="text-uppercase"
            maxlength="20"
            class="q-mr-sm"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-btn flat dense no-caps icon="close" v-close-popup />
        </q-toolbar>
        <q-separator />
        <q-card-section>
          <q-table
            flat
            :data="dataUserNonSecure"
            :columns="membercolumns"
            row-key="id"
            :pagination.sync="pagination"
            :rows-per-page-options="[5]"
            :filter="filteradd"
            rows-per-page-label="DATA PER HALAMAN:"
            hide-no-data
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="id" :props="props" auto-width>{{ props.row.id }}</q-td>
                <q-td key="name" :props="props">{{ props.row.name }}</q-td>
                <q-td key="actions" :props="props" auto-width>
                  <q-btn-group flat>
                    <q-btn
                      dense
                      unelevated
                      text-color="info"
                      icon="crop_din"
                      @click="dispUpdate(props.row)"
                    >
                      <q-tooltip anchor="bottom middle" self="top end">UPDATE {{ props.row.name }}</q-tooltip>
                    </q-btn>
                  </q-btn-group>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="windUpdate" persistent transition-show="none" transition-hide="none">
      <q-card class="q-pa-none" style="width:420px">
        <q-toolbar>
          <q-icon name="crop_din" class="text-primary" size="sm" />
          <q-toolbar-title>UPDATE USER</q-toolbar-title>
          <q-btn flat dense no-caps icon="close" v-close-popup />
        </q-toolbar>
        <q-separator />
        <q-card-section>
          <div class="q-gutter-xs">
            <q-input
              dense
              bottom-slots
              readonly
              borderless
              :value="formupdate.id"
              v-model="formupdate.id"
              label="ID"
              maxlength="50"
            ></q-input>
            <q-input
              dense
              bottom-slots
              readonly
              :value="formupdate.name"
              v-model="formupdate.name"
              label="Nama"
              input-class="text-uppercase"
            ></q-input>
            <div class="row">
              <div class="col q-mr-xs">
                <q-select
                  dense
                  bottom-slots
                  v-model="formupdate.iduserfield"
                  :options="dataUserField"
                  option-value="id"
                  option-label="userfield"
                  emit-value
                  map-options
                  label="Jabatan"
                  :error="$v.formupdate.iduserfield.$error"
                  error-message="Pilih Jabatan"
                ></q-select>
              </div>
              <div class="col">
                <q-select
                  dense
                  clearable
                  clear-icon="close"
                  bottom-slots
                  v-model="formupdate.idcoa"
                  :options="dataCoaCash"
                  option-value="id"
                  option-label="accname"
                  emit-value
                  map-options
                  label="Kas DEBET"
                >
                  <template v-slot:selected-item="scope">{{ scope.opt.id }} {{ scope.opt.accname }}</template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                      <q-item-section>
                        <q-item-label>{{ scope.opt.id }}</q-item-label>
                        <q-item-label caption>{{ scope.opt.accname }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-section align="right">
          <q-btn-group flat>
            <q-btn
              unelevated
              no-caps
              color="primary"
              label="Update"
              :loading="loading"
              @click="onUpdate()"
            />
          </q-btn-group>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="windResetPassword" persistent transition-show="none" transition-hide="none">
      <q-card class="q-pa-none" style="width:380px">
        <q-toolbar>
          <q-avatar square>
            <q-icon name="restart_alt" class="menu-icon" />
          </q-avatar>
          <q-toolbar-title>RESET PASSWORD</q-toolbar-title>
          <q-btn flat dense icon="close" v-close-popup />
        </q-toolbar>
        <q-separator />
        <q-card-section>
          <q-input
            dense
            readonly
            borderless
            bottom-slots
            :value="formpassword.name"
            v-model="formpassword.name"
            label="Nama User"
            maxlength="50"
            input-class="text-uppercase"
          ></q-input>
          <q-input
            dense
            :value="formpassword.password"
            v-model="formpassword.password"
            type="password"
            label="Password"
            maxlength="50"
            :error="$v.formpassword.password.$error"
            error-message="Password minimal 6 karakter"
          ></q-input>
          <q-input
            dense
            :value="formpassword.passwordconfirm"
            v-model="formpassword.passwordconfirm"
            type="password"
            label="Konfirmasi Password"
            maxlength="50"
            :error="$v.formpassword.passwordconfirm.$error"
            error-message="Konfirmasi Password Tidak Sesuai"
          ></q-input>
        </q-card-section>
        <q-card-section align="right">
          <q-btn
            unelevated
            no-caps
            :loading="loading"
            color="primary"
            label="Reset"
            @click="onResetPassword()"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="windDelete" persistent transition-show="none" transition-hide="none">
      <q-card class="q-pa-none" style="min-width:420px">
        <q-toolbar>
          <q-avatar square>
            <q-icon name="delete" class="menu-icon" />
          </q-avatar>
          <q-toolbar-title>USER SISE</q-toolbar-title>
          <q-btn flat dense no-caps icon="close" v-close-popup />
        </q-toolbar>
        <q-separator />
        <q-card-section>HAPUS USER {{ this.formupdate.name }}?</q-card-section>
        <q-card-section align="right">
          <q-btn
            unelevated
            no-caps
            color="primary"
            label="Hapus"
            :loading="loading"
            @click="onDelete()"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { date } from 'quasar'
import { required, sameAs, minLength } from 'vuelidate/lib/validators'
import { mapState } from 'vuex'
export default {
  name: 'Manageuser',
  preFetch ({ store }) {
    store.dispatch('users/usersecure')
    store.dispatch('users/userfield')
    store.dispatch('chartofaccounts/getcoacash')
  },
  data () {
    return {
      loading: false,
      loadingsignout: false,
      loadingprint: false,
      loadingconfig: false,
      loadingpassword: false,
      darktheme: false,
      windInsert: false,
      windUpdate: false,
      windUpdateUser: false,
      windDelete: false,
      windResetPassword: false,
      filter: '',
      filteradd: '',
      pagination: {
        page: 1,
        rowsPerPage: 5
      },
      forminsert: {
        email: '',
        name: '',
        idrole: '',
        idcoa: '',
        password: '',
        passwordconfirm: ''
      },
      formupdate: {
        id: '',
        name: '',
        iduserfield: '',
        idcoa: ''
      },
      formpassword: {
        id: '',
        email: '',
        name: '',
        password: '',
        passwordconfirm: ''
      },
      columns: [
        {
          name: 'id',
          align: 'left',
          label: 'ID',
          field: 'id',
          sortable: false,
          headerClasses: 'bgtitle'
        },
        {
          name: 'name',
          align: 'left',
          label: 'NAMA',
          field: 'name',
          sortable: false,
          headerClasses: 'bgtitle'
        },
        {
          name: 'userfield',
          align: 'left',
          label: 'JABATAN',
          field: 'userfield',
          sortable: false,
          headerClasses: 'bgtitle'
        },
        {
          name: 'idcoa',
          align: 'left',
          label: 'KAS DEBET',
          field: 'idcoa',
          sortable: false,
          headerClasses: 'bgtitle'
        },
        {
          name: 'accname',
          align: 'left',
          label: '',
          field: 'accname',
          sortable: false,
          headerClasses: 'bgtitle'
        },
        {
          name: 'lastsign',
          align: 'left',
          label: 'LAST SIGN IN',
          field: 'lastsign',
          sortable: false,
          headerClasses: 'bgtitle'
        },
        { name: 'actions', align: 'right', label: '', headerClasses: 'bgtitle' }
      ],
      membercolumns: [
        {
          name: 'id',
          align: 'left',
          label: 'ID',
          field: 'id',
          sortable: false
        },
        {
          name: 'name',
          align: 'left',
          label: 'NAMA',
          field: 'name',
          sortable: false
        },
        { name: 'actions', align: 'right', label: '' }
      ]
    }
  },
  validations: {
    forminsert: {
      email: { required },
      name: { required },
      password: { required, minLength: minLength(6) },
      idrole: { required }
    },
    formupdate: {
      name: { required },
      iduserfield: { required }
    },
    formpassword: {
      password: { required, minLength: minLength(6) },
      passwordconfirm: { sameAsPassword: sameAs('password') }
    }
  },
  computed: {
    ...mapState({
      dataConfig: (state) => state.configs.config,
      dataServerDate: (state) => state.configs.serverdate,
      dataUser: (state) => state.auth.user,
      dataUserSecure: (state) => state.users.usersecure,
      dataUserNonSecure: (state) => state.users.usernonsecure,
      dataUserField: (state) => state.users.userfield,
      dataCoaCash: (state) => state.chartofaccounts.coacash,
      dataRegion: (state) => state.regions.region,
      dataIp: (state) => state.auth.ip,
      dataPaper: (state) => state.configs.paper
    })
  },
  mounted () {},
  methods: {
    formatDate (fdate) {
      const formattedString = date.formatDate(fdate, 'DD-MM-YYYY')
      return formattedString
    },
    formatDateTime (fdate) {
      const formattedString = date.formatDate(fdate, 'DD-MM-YYYY HH:mm:ss')
      return formattedString
    },
    dispInsert () {
      this.filteradd = ''
      this.windInsert = true
      Promise.all([this.$store.dispatch('users/usernonsecure')]).finally(() => {
        this.skeleton = false
      })
    },
    dispUpdate (data) {
      this.$v.$reset()
      Promise.all([
        (this.formupdate.iduserfield = null),
        (this.formupdate = Object.assign(this.formupdate, data))
      ]).finally(() => {
        this.windUpdate = true
      })
    },
    dispDelete () {
      this.windDelete = true
    },
    dispResetPassword (data) {
      this.$v.$reset()
      this.formpassword.password = ''
      this.formpassword.passwordconfirm = ''
      this.isPwd = true
      Promise.all([
        (this.formpassword = Object.assign(this.formpassword, data))
      ]).finally(() => {
        this.windResetPassword = true
      })
    },
    onInsert () {
      this.$v.forminsert.$touch()
      if (!this.$v.forminsert.$error) {
        this.loading = true
        this.$store
          .dispatch('auth/insertuser', this.forminsert)
          .then(() => {
            this.windInsert = false
            this.$q.notify({
              position: 'bottom-right',
              color: 'positive',
              textColor: 'white',
              timeout: 2500,
              icon: 'done',
              message: 'USER SISE created'
            })
          })
          .catch(() => {
            this.$q.notify({
              position: 'bottom-right',
              color: 'negative',
              textColor: 'white',
              timeout: 3500,
              icon: 'error_outline',
              message: 'USER SISE create FAILED!'
            })
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    onUpdate () {
      this.$v.formupdate.$touch()
      if (!this.$v.formupdate.$error) {
        this.loading = true
        this.$store
          .dispatch('users/updateusersecure', this.formupdate)
          .then(() => {
            this.windUpdate = false
            this.$store.dispatch('users/usernonsecure')
            this.$q.notify({
              position: 'top-right',
              color: 'positive',
              textColor: 'white',
              timeout: 2500,
              icon: 'done',
              message: 'App USER updated'
            })
          })
          .catch(() => {
            this.$q.notify({
              position: 'top-right',
              color: 'negative',
              textColor: 'white',
              timeout: 3500,
              icon: 'error_outline',
              message: 'App USER update FAILED!'
            })
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    onDelete () {
      this.loading = true
      this.$store
        .dispatch('auth/deleteuser', this.formupdate)
        .then(() => {
          this.$q.notify({
            position: 'bottom-right',
            color: 'positive',
            textColor: 'white',
            timeout: 2500,
            icon: 'done',
            message: 'USER SISE deleted'
          })
          this.windDelete = false
          this.windUpdate = false
        })
        .catch(() => {
          this.$q.notify({
            position: 'bottom-right',
            color: 'negative',
            textColor: 'white',
            timeout: 3500,
            icon: 'error_outline',
            message: 'USER SISE delete FAILED!'
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    onResetPassword () {
      this.$v.formpassword.$touch()
      if (!this.$v.formpassword.$error) {
        this.loading = true
        this.$store
          .dispatch('auth/resetpassword', this.formpassword)
          .then(() => {
            this.windResetPassword = false
            this.$q.notify({
              position: 'bottom-right',
              color: 'primary',
              textColor: 'white',
              timeout: 2500,
              icon: 'done',
              message: 'USER PASSWORD reseted!'
            })
          })
          .catch((error) => {
            if (error.response) {
              this.$q.notify({
                position: 'bottom-right',
                color: 'red-10',
                textColor: 'white',
                timeout: 2500,
                icon: 'error_outline',
                message: 'USER PASSWORD reset FAILED!'
              })
            }
          })
          .finally(() => {
            this.loading = false
          })
      }
    }
  }
}
</script>
