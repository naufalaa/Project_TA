<template>
  <q-page>
    <q-toolbar class="q-pl-md q-pr-md bgtitle">
      <q-icon name="o_local_shipping" size="sm" />
      <q-toolbar-title>
        <span class="text-primary">PENGATURAN</span> JASA PENGIRIMAN / KURIR
      </q-toolbar-title>
      <q-space />
      <q-input dense debounce="300" v-model="filter" input-class="text-uppercase" maxlength="20">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-btn-group flat class="q-ml-sm">
        <q-btn flat dense color="primary" icon="add" @click="dispInsert()">
          <q-tooltip anchor="bottom middle" self="top end">TAMBAH KURIR</q-tooltip>
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
              :data="dataCourier"
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
                  <q-td auto-width key="courier" :props="props">{{ props.row.courier }}</q-td>
                  <q-td auto-width key="courierdesc" :props="props">{{ props.row.courierdesc }}</q-td>
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
                        >UPDATE {{ props.row.productname }}</q-tooltip>
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
          <q-toolbar-title>JASA PENGIRIMAN / KURIR</q-toolbar-title>
          <q-btn flat dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section>
          <q-input
            dense
            counter
            :value="forminsert.courier"
            v-model="forminsert.courier"
            label="Kurir"
            hint="Contoh: JNE"
            maxlength="50"
            :error="$v.forminsert.courier.$error"
            error-message="Jasa Kurir harus diisi"
          ></q-input>
          <q-input
            dense
            counter
            :value="forminsert.courierdesc"
            v-model="forminsert.courierdesc"
            label="Produk Layanan"
            hint="Contoh: Express, Regular"
            maxlength="50"
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
          <q-toolbar-title>JASA PENGIRIMAN / KURIR</q-toolbar-title>
          <q-btn flat dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section>
          <q-input
            dense
            counter
            :value="formupdate.courier"
            v-model="formupdate.courier"
            label="JASA KURIR"
            hint="Contoh: JNE"
            maxlength="50"
            :error="$v.formupdate.courier.$error"
            error-message="Jasa Kurir harus diisi"
          ></q-input>
          <q-input
            dense
            counter
            :value="formupdate.courierdesc"
            v-model="formupdate.courierdesc"
            label="Produk Layanan"
            hint="Contoh: Express, Regular"
            maxlength="50"
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
          <q-toolbar-title>HAPUS JASA PENGIRIMAN / KURIR</q-toolbar-title>
          <q-btn padding="xs sm" unelevated icon="close" v-close-popup />
        </q-toolbar>
        <q-separator />
        <q-card-section
          class="text-info"
        >Hapus Jasa Pengiriman / Kurir {{ this.formupdate.courier }}?</q-card-section>
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
    store.dispatch('couriers/getcourier')
  },
  data () {
    return {
      loading: false,
      filter: '',
      windInsert: false,
      windUpdate: false,
      windDelete: false,
      forminsert: {
        courier: '',
        courierdesc: ''
      },
      formupdate: {
        id: '',
        courier: '',
        courierdesc: ''
      },
      columns: [
        {
          name: 'courier',
          align: 'left',
          label: 'KURIR',
          field: 'courier',
          sortable: false,
          headerClasses: 'bgtable'
        },
        {
          name: 'courierdesc',
          align: 'left',
          label: 'PRODUK LAYANAN',
          field: 'courierdesc',
          sortable: false,
          headerClasses: 'bgtable'
        },
        { name: 'actions', align: 'right', label: '', headerClasses: 'bgtable' }
      ]
    }
  },
  validations: {
    forminsert: {
      courier: { required }
    },
    formupdate: {
      courier: { required }
    }
  },
  computed: {
    ...mapState({
      dataConfig: (state) => state.configs.config,
      dataCourier: (state) => state.couriers.courier,
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
      Promise.all([
        (this.forminsert.courier = ''),
        (this.forminsert.courierdesc = '')
      ]).finally(() => {
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
          .dispatch('couriers/insertcourier', this.forminsert)
          .then(() => {
            this.$q.notify({
              position: 'bottom-right',
              color: 'positive',
              textColor: 'white',
              timeout: 2500,
              icon: 'done',
              message: 'JASA PENGIRIMAN / KURIR berhasil disimpan!'
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
              message: 'JASA PENGIRIMAN / KURIR gagal disimpan!'
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
          .dispatch('couriers/updatecourier', this.formupdate)
          .then(() => {
            this.$q.notify({
              position: 'bottom-right',
              color: 'positive',
              textColor: 'white',
              timeout: 2500,
              icon: 'done',
              message: 'JASA PENGIRIMAN / KURIR berhasil diupdate!'
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
              message: 'JASA PENGIRIMAN / KURIR gagal diupdate!'
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
        .dispatch('couriers/deletecourier', this.formupdate)
        .then(() => {
          this.$q.notify({
            position: 'bottom-right',
            color: 'positive',
            textColor: 'white',
            timeout: 2500,
            icon: 'done',
            message: 'JASA PENGIRIMAN / KURIR telah dihapus!'
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
            message: 'JASA PENGIRIMAN / KURIR gagal dihapus!'
          })
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
