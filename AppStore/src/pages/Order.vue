<template>
  <q-page>
    <q-toolbar class="q-pl-md q-pr-md bgtitle">
      <q-icon name="o_local_mall" size="sm" />
      <q-toolbar-title>
        <span class="text-primary">ADMINISTRASI</span> PESANAN
      </q-toolbar-title>
      <q-space />
      <q-input dense debounce="300" v-model="filter" input-class="text-uppercase" maxlength="20">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </q-toolbar>
    <q-separator />
    <q-scroll-area style="height: calc(100vh - 136px);">
      <div class="q-pa-md">
        <q-card flat square bordered class="q-pa-none" style="min-height: calc(100vh - 170px);">
          <q-card-section>
            <q-table
              flat
              :data="dataTransaction"
              :columns="columns"
              row-key="id"
              :rows-per-page-options="[10, 20, 30, 40, 50]"
              :filter="filter"
              rows-per-page-label="Order:"
              separator="none"
              hide-no-data
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td auto-width key="id" :props="props">{{ props.row.id }}</q-td>
                  <q-td key="datetr" :props="props">{{ formatDate(props.row.datetr) }}</q-td>
                  <q-td key="subtotal" :props="props">Rp&nbsp;{{ formatPrice(props.row.subtotal) }}</q-td>
                  <q-td key="name" :props="props">{{ props.row.name }}</q-td>
                  <q-td auto-width key="status" :props="props">
                    <div
                      v-if="props.row.status==0"
                      class="text-red text-subtitle2"
                    >Menunggu Konfirmasi</div>
                    <div
                      v-if="props.row.status==1"
                      class="text-primary text-subtitle2"
                    >Menunggu Pembayaran</div>
                    <div v-if="props.row.status==2" class="text-red text-subtitle2">Menunggu Proses</div>
                    <div v-if="props.row.status==3" class="text-primary text-subtitle2">Dikirim</div>
                    <div v-if="props.row.status==4" class="text-green text-subtitle2">Selesai</div>
                  </q-td>
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
                        >DETAIL INVOICE {{ props.row.id }}</q-tooltip>
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

    <q-dialog
      v-model="windUpdate"
      persistent
      full-height
      full-width
      transition-show="none"
      transition-hide="none"
    >
      <q-card class="q-pa-none">
        <q-toolbar>
          <q-avatar square>
            <q-icon name="crop_din" class="menu-icon" size="sm" />
          </q-avatar>
          <q-toolbar-title>UPDATE PESANAN</q-toolbar-title>
          <q-banner
            v-if="formupdate.status==0"
            inline-actions
            rounded
            dense
            class="bg-orange-6 text-white"
          >Menunggu Konfirmasi</q-banner>
          <q-banner
            v-if="formupdate.status==1"
            inline-actions
            rounded
            dense
            class="bg-primary text-white"
          >Menunggu Pembayaran</q-banner>
          <q-banner
            v-if="formupdate.status==2"
            inline-actions
            rounded
            dense
            class="bg-orange-6 text-white"
          >Menunggu Proses</q-banner>
          <q-banner
            v-if="formupdate.status==3"
            inline-actions
            rounded
            dense
            class="bg-primary text-white"
          >Dikirim</q-banner>
          <q-banner
            v-if="formupdate.status==4"
            inline-actions
            rounded
            dense
            class="bg-primary text-white"
          >Selesai</q-banner>
          <q-btn flat dense icon="close" class="q-ml-md" v-close-popup />
        </q-toolbar>
        <div class="row q-col-gutter-md">
          <div class="col-6">
            <q-card-section>
              <div class="text-weight-bold">Nomor Invoice</div>
              <div>{{ formupdate.id }}</div>
              <br />
              <div class="text-weight-bold">Alamat Pengiriman</div>
              <div>{{ formupdate.name }}</div>
              <div>{{ formupdate.phone }}</div>
              <div>{{ formupdate.address }}</div>
              <div>KEC. {{ formupdate.district }},&nbsp;{{ formupdate.regency }},&nbsp;{{ formupdate.province }}&nbsp;{{ formupdate.postalcode }}</div>
            </q-card-section>
            <q-card-section>
              <div class="text-weight-bold">Daftar Belanja</div>
              <br />
              <q-table
                flat
                :data="dataCheckout"
                :columns="colcheckout"
                row-key="id"
                separator="none"
                rows-per-page-label="DATA PER HALAMAN:"
                :pagination.sync="pagination"
                hide-bottom
                hide-header
                hide-no-data
                dense
              >
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td auto-width key="img" :props="props">
                      <q-avatar rounded size="40px">
                        <img :src="$apiURL + '/images/product/' + props.row.imgname" />
                      </q-avatar>
                    </q-td>
                    <q-td key="productname" :props="props">
                      <div class="text-weight-bold text-subtitle2">{{ props.row.productname }}</div>
                      <div v-if="props.row.discount > 0" align="left">
                        <q-badge transparent color="red" class="q-pa-xs">{{ props.row.discount }}%</q-badge>&nbsp;
                        <span
                          class="text-strike text-caption"
                        >Rp{{ formatPrice(props.row.price) }}</span>
                        <span>&nbsp;Rp{{ formatPrice(props.row.price - (props.row.price * props.row.discount) / 100) }}&nbsp;Jumlah:&nbsp;{{ props.row.qty }}&nbsp;Barang</span>
                      </div>
                      <div v-else align="left">
                        <span>Rp{{ formatPrice(props.row.price) }}&nbsp;Jumlah:&nbsp;{{ props.row.qty }}&nbsp;Barang</span>
                      </div>
                      <div align="left">
                        <span class="text-caption">Catatan:{{ props.row.remark }}</span>
                      </div>
                    </q-td>
                    <q-td auto-width key="subtotal" :props="props">
                      <span class="text-weight-bold">Rp{{ formatPrice(props.row.subtotal) }}</span>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </q-card-section>
          </div>
          <div class="col-6">
            <q-card-section>
              <q-card flat bordered>
                <q-card-section>
                  <div class="row">
                    <div class="col-6 text-weight-bold">Total Belanja</div>
                    <div
                      class="col-6 text-weight-bold"
                      align="right"
                    >Rp{{ formatPrice(sumSubtotal) }}</div>
                  </div>
                  <div class="row">
                    <div class="col-4">Kurir</div>
                    <div class="col-8">{{ formupdate.courier }}&nbsp;{{ formupdate.courierdesc }}</div>
                  </div>
                  <div v-if="formupdate.status > 0">
                    <div class="row items-center">
                      <div class="col-4">Biaya Kurir</div>
                      <div class="col-8" align="right">Rp{{ formatPrice(formupdate.couriercost) }}</div>
                    </div>
                    <div v-if="formupdate.status > 2" class="row items-center">
                      <div class="col-4">Nomor Resi</div>
                      <div class="col-8" align="left">{{ formupdate.receiptnumber }}</div>
                    </div>
                    <div class="row items-center">
                      <div class="col-4">Kode Unik</div>
                      <div class="col-8" align="right">{{ formatPrice(formupdate.uniquecode) }}</div>
                    </div>
                    <q-separator />
                    <br />
                    <div class="row">
                      <div class="col-4 text-weight-bold">Total Transfer</div>
                      <div
                        class="col-8 text-weight-bold"
                        align="right"
                      >Rp{{ formatPrice(parseFloat(sumSubtotal) + parseFloat(formupdate.couriercost) + parseFloat(formupdate.uniquecode)) }}</div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
              <br />
              <div v-if="formupdate.status > 1">
                <div class="text-weight-bold">Konfirmasi Pembayaran</div>
                <q-card flat bordered>
                  <q-card-section>
                    <div class="row">
                      <div class="col-4">Bank Transfer</div>
                      <div
                        class="col-4"
                        align="left"
                      >{{ formupdate.bankname }}&nbsp;{{ formupdate.branch }}</div>
                    </div>
                    <div class="row">
                      <div class="col-4">Jumlah Transfer</div>
                      <div class="col-8" align="right">Rp{{ formatPrice(formupdate.transfer) }}</div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
              <q-card v-if="formupdate.status==0" flat bordered>
                <q-card-section>
                  <div class="row items-center">
                    <div class="col-6 text-weight-bold">Biaya Kurir</div>
                    <div class="col-6">
                      <q-input
                        dense
                        :value="formupdate.nominal"
                        v-model="formupdate.nominal"
                        ref="nominal"
                        :error="$v.formupdate.nominal.$error"
                        error-message="Biaya Kurir harus di isi!"
                        v-currency="options"
                        input-class="text-right"
                        @focus="$event.target.select()"
                      ></q-input>
                    </div>
                  </div>
                  <div align="right">
                    <q-btn
                      unelevated
                      no-caps
                      color="primary"
                      label="Proses"
                      :loading="loading"
                      @click="onUpdate()"
                    />
                  </div>
                </q-card-section>
              </q-card>
              <br />
              <q-card v-if="formupdate.status==2" flat bordered>
                <q-card-section>
                  <div class="row items-center">
                    <div class="col-6 text-weight-bold">Nomor Resi Pengiriman</div>
                    <div class="col-6">
                      <q-input
                        dense
                        :value="formupdate.receiptnumber"
                        v-model="formupdate.receiptnumber"
                        maxlength="50"
                        :error="$v.formupdate.receiptnumber.$error"
                        error-message="Nomor Resi Pengiriman harus diisi"
                        input-class="text-uppercase"
                      ></q-input>
                    </div>
                  </div>
                  <div align="right">
                    <q-btn
                      unelevated
                      no-caps
                      color="primary"
                      label="Proses"
                      :loading="loading"
                      @click="onUpdateReceipt()"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </q-card-section>
          </div>
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import { date } from 'quasar'
import { CurrencyDirective, getValue } from 'vue-currency-input'
export default {
  name: 'Order',
  preFetch ({ store }) {
    store.dispatch('transactions/getalltransaction')
  },
  directives: {
    currency: CurrencyDirective
  },
  data () {
    return {
      loading: false,
      filter: '',
      windUpdate: false,
      pagination: {
        sortBy: 'name',
        descending: false,
        page: 1,
        rowsPerPage: 10
      },
      formupdate: {
        id: '',
        nominal: 0,
        transfer: 0,
        couriercost: 0,
        receiptnumber: ''
      },
      columns: [
        {
          name: 'id',
          align: 'left',
          label: 'INVOICE',
          field: 'id',
          sortable: false,
          headerClasses: 'bgtable'
        },
        {
          name: 'datetr',
          align: 'left',
          label: 'TANGGAL',
          field: 'datetr',
          sortable: false,
          headerClasses: 'bgtable'
        },
        {
          name: 'subtotal',
          align: 'right',
          label: 'SUBTOTAL',
          field: 'subtotal',
          sortable: false,
          headerClasses: 'bgtable'
        },
        {
          name: 'name',
          align: 'left',
          label: 'NAMA PEMESAN',
          field: 'name',
          sortable: false,
          headerClasses: 'bgtable'
        },
        {
          name: 'status',
          align: 'left',
          sortable: false,
          headerClasses: 'bgtable'
        },
        { name: 'actions', align: 'right', headerClasses: 'bgtable' }
      ],
      colcheckout: [
        {
          name: 'img',
          align: 'left',
          required: true,
          sortable: false,
          headerClasses: 'bgtable'
        },
        {
          name: 'productname',
          required: true,
          label: 'PRODUK',
          align: 'left',
          field: 'productname',
          sortable: false,
          headerClasses: 'bgtable'
        },
        {
          name: 'subtotal',
          required: true,
          label: 'SUBTOTAL',
          align: 'right',
          field: 'subtotal',
          sortable: false,
          headerClasses: 'bgtable'
        }
      ]
    }
  },
  validations: {
    formupdate: {
      nominal: { required },
      receiptnumber: { required }
    }
  },
  computed: {
    ...mapState({
      dataConfig: (state) => state.configs.config,
      dataTransaction: (state) => state.transactions.alltransaction,
      dataCheckout: (state) => state.checkouts.checkout,
      dataUser: (state) => state.auth.user
    }),
    sumSubtotal () {
      return this.dataCheckout.reduce((sum, total) => {
        return (sum += parseFloat(total.subtotal))
      }, 0)
    },
    options () {
      return {
        locale: undefined,
        currency: null
      }
    }
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
        (this.forminsert.bankname = ''),
        (this.forminsert.branch = ''),
        (this.forminsert.accnumber = '')
      ]).finally(() => {
        this.windInsert = true
      })
    },
    dispUpdate (data) {
      this.$v.$reset()
      this.formupdate.nominal = 0
      Promise.all([
        (this.formupdate = Object.assign(this.formupdate, data)),
        this.$store.dispatch('checkouts/getcheckout', this.formupdate.id)
      ]).finally(() => {
        this.windUpdate = true
      })
    },
    dispDelete () {
      this.windDelete = true
    },
    onUpdate () {
      this.$v.formupdate.$touch()
      this.formupdate.couriercost = getValue(this.$refs.nominal)
      this.formupdate.receiptnumber = '0'
      if (!this.$v.formupdate.$error) {
        this.loading = true
        this.$store
          .dispatch('transactions/updatecost', this.formupdate)
          .then(() => {
            this.$q.notify({
              position: 'bottom-right',
              color: 'positive',
              textColor: 'white',
              timeout: 2500,
              icon: 'done',
              message: 'Transaksi berhasil, Menunggu konfirmasi!'
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
              message: 'Transaksi gagal diproses!'
            })
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    onUpdateReceipt () {
      this.$v.formupdate.$touch()
      if (!this.$v.formupdate.$error) {
        this.loading = true
        this.$store
          .dispatch('transactions/updatereceipt', this.formupdate)
          .then(() => {
            this.$q.notify({
              position: 'bottom-right',
              color: 'positive',
              textColor: 'white',
              timeout: 2500,
              icon: 'done',
              message: 'Transaksi Telah diproses!'
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
              message: 'Transaksi gagal diproses!'
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
        .dispatch('banks/deletebank', this.formupdate)
        .then(() => {
          this.$q.notify({
            position: 'bottom-right',
            color: 'positive',
            textColor: 'white',
            timeout: 2500,
            icon: 'done',
            message: 'BANK TRANSFER telah dihapus!'
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
            message: 'BANK TRANSFER gagal dihapus!'
          })
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
