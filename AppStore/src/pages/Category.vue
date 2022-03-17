<template>
  <q-page>
    <q-toolbar class="q-pl-md q-pr-md bgtitle">
      <q-icon name="o_space_dashboard" size="sm" />
      <q-toolbar-title>
        <span class="text-primary">PENGATURAN</span> KATEGORI PRODUK
      </q-toolbar-title>
      <q-space />
      <q-input dense debounce="300" v-model="filter" input-class="text-uppercase" maxlength="20">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-btn-group flat class="q-ml-sm">
        <q-btn flat dense color="primary" icon="add" @click="dispInsert()">
          <q-tooltip anchor="bottom middle" self="top end">TAMBAH KATEGORI</q-tooltip>
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
              :data="dataCategory"
              :columns="columns"
              row-key="id"
              :rows-per-page-options="[50]"
              :filter="filter"
              rows-per-page-label="DATA PER HALAMAN:"
              separator="none"
              hide-no-data
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td auto-width key="category" :props="props">{{ props.row.category }}</q-td>
                  <q-td key="actions" :props="props">
                    <q-btn-group flat>
                      <q-btn
                        dense
                        unelevated
                        text-color="info"
                        icon="crop_din"
                        @click="dispUpdate(props.row)"
                      >
                        <q-tooltip
                          anchor="bottom middle"
                          self="top end"
                        >UPDATE {{ props.row.category }}</q-tooltip>
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
      <q-card class="q-pa-none" style="width:380px">
        <q-toolbar>
          <q-avatar square>
            <q-icon name="add" class="menu-icon" size="sm" />
          </q-avatar>
          <q-toolbar-title>TAMBAH KATEGORI</q-toolbar-title>
          <q-btn flat dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section>
          <q-input
            dense
            counter
            :value="forminsert.category"
            v-model="forminsert.category"
            label="Kategori"
            hint="Jenis Kategori Produk"
            maxlength="50"
            :error="$v.forminsert.category.$error"
            error-message="Nama Kategori harus diisi"
          ></q-input>
        </q-card-section>
        <q-card-section align="right">
          <q-btn
            unelevated
            no-caps
            color="primary"
            label="Simpan"
            :loading="loading"
            @click="onInsert()"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="windUpdate" persistent transition-show="none" transition-hide="none">
      <q-card class="q-pa-none" style="width:380px">
        <q-toolbar>
          <q-avatar square>
            <q-icon name="crop_din" class="menu-icon" size="sm" />
          </q-avatar>
          <q-toolbar-title>UPDATE KATEGORI</q-toolbar-title>
          <q-btn flat dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section>
          <q-input
            dense
            counter
            :value="formupdate.category"
            v-model="formupdate.category"
            label="Kategori"
            maxlength="50"
            :error="$v.formupdate.category.$error"
            error-message="Kategori harus diisi"
          ></q-input>
        </q-card-section>
        <q-card-section align="right">
          <q-btn
            unelevated
            no-caps
            color="primary"
            label="Hapus"
            class="q-mr-sm"
            @click="windDelete = !windDelete"
          />
          <q-btn
            unelevated
            no-caps
            color="primary"
            label="Update"
            :loading="loading"
            @click="onUpdate()"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="windDelete" persistent transition-show="none" transition-hide="none">
      <q-card class="q-pa-none" style="width:420px">
        <q-toolbar>
          <q-avatar square>
            <q-icon name="delete" class="menu-icon" size="sm" />
          </q-avatar>
          <q-toolbar-title>HAPUS KATEGORI</q-toolbar-title>
          <q-btn padding="xs sm" unelevated icon="close" v-close-popup />
        </q-toolbar>
        <q-separator />
        <q-card-section class="text-info">Hapus Kategori {{ this.formupdate.category }}?</q-card-section>
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
import { mapState } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import { date } from 'quasar'
export default {
  name: 'Bank',
  preFetch ({ store }) {
    store.dispatch('categories/getcategory')
  },
  data () {
    return {
      loading: false,
      filter: '',
      windInsert: false,
      windUpdate: false,
      windDelete: false,
      forminsert: {
        category: ''
      },
      formupdate: {
        id: '',
        category: ''
      },
      columns: [
        {
          name: 'category',
          align: 'left',
          label: 'KATEGORI',
          field: 'category',
          sortable: false,
          headerClasses: 'bgtable'
        },
        { name: 'actions', align: 'right', label: '', headerClasses: 'bgtable' }
      ]
    }
  },
  validations: {
    forminsert: {
      category: { required }
    },
    formupdate: {
      category: { required }
    }
  },
  computed: {
    ...mapState({
      dataConfig: (state) => state.configs.config,
      dataCategory: (state) => state.categories.category,
      dataUser: (state) => state.auth.user
    })
  },
  mounted () {},
  methods: {
    formatDate (fdate) {
      const formattedString = date.formatDate(fdate, 'DD-MM-YYYY')
      return formattedString
    },
    formatPrice (value) {
      const val = (value / 1).toFixed(0).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    dispInsert () {
      this.$v.$reset()
      Promise.all([(this.forminsert.category = '')]).finally(() => {
        this.windInsert = true
      })
    },
    dispUpdate (data) {
      this.$v.$reset()
      Promise.all([
        (this.formupdate = Object.assign(this.formupdate, data))
      ]).finally(() => {
        this.windUpdate = true
      })
    },
    onInsert () {
      this.$v.forminsert.$touch()
      if (!this.$v.forminsert.$error) {
        this.loading = true
        this.$store
          .dispatch('categories/insertcategory', this.forminsert)
          .then(() => {
            this.$q.notify({
              position: 'bottom-right',
              color: 'positive',
              textColor: 'white',
              timeout: 2500,
              icon: 'done',
              message: 'KATEGORI telah disimpan!'
            })
            this.windInsert = false
          })
          .catch(() => {
            this.$q.notify({
              position: 'bottom-right',
              color: 'negative',
              textColor: 'white',
              timeout: 2500,
              icon: 'error_outline',
              message: 'KATEGORI gagal disimpan!'
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
          .dispatch('categories/updatecategory', this.formupdate)
          .then(() => {
            this.$q.notify({
              position: 'bottom-right',
              color: 'positive',
              textColor: 'white',
              timeout: 2500,
              icon: 'done',
              message: 'KATEGORI berhasil diupdate!'
            })
            this.windUpdate = false
          })
          .catch(() => {
            this.$q.notify({
              position: 'bottom-right',
              color: 'negative',
              textColor: 'white',
              timeout: 2500,
              icon: 'error_outline',
              message: 'KATEGORI gagal diupdate!'
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
        .dispatch('categories/deletecategory', this.formupdate)
        .then(() => {
          this.$q.notify({
            position: 'bottom-right',
            color: 'positive',
            textColor: 'white',
            timeout: 2500,
            icon: 'done',
            message: 'KATEGORI telah dihapus'
          })
          this.windUpdate = false
          this.windDelete = false
        })
        .catch(() => {
          this.$q.notify({
            position: 'bottom-right',
            color: 'negative',
            textColor: 'white',
            timeout: 2500,
            icon: 'error_outline',
            message: 'KATEGORI gagal dihapus!'
          })
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
