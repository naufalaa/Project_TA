<template>
  <q-page>
    <div class="row justify-center q-pt-md">
      <div class="col-10">
        <div class="row q-col-gutter-md">
          <div class="col-9">
            <div class="item-center">
              <q-avatar rounded size="84px">
                <q-img src="~assets/checkout.png" />
              </q-avatar>
              <span class="text-h6">&nbsp;Checkout</span>
            </div>
            <br />
            <div class="text-weight-bold">Alamat Pengiriman</div>
            <q-separator />
            <div class="text-weight-bold">{{ dataUser.name }}</div>
            <div>{{ dataUser.phone }}</div>
            <div>{{ dataUser.address }}</div>
            <div>KEC. {{ dataUser.district }},&nbsp;{{ dataUser.regency }},&nbsp;{{ dataUser.province }}&nbsp;{{ dataUser.postalcode }}</div>
            <br />
            <q-separator />
            <q-table
              flat
              :data="dataCart"
              :columns="columns"
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
                  <q-td key="productname" :props="props">
                    <div class="row">
                      <div class="col-1" align="left">
                        <q-avatar rounded>
                          <img :src="$apiURL + '/images/product/' + props.row.imgname" />
                        </q-avatar>
                      </div>
                      <div class="col-8">
                        <div class="text-weight-bold">{{ props.row.productname }}</div>
                        <div v-if="props.row.discount > 0" align="left">
                          <q-badge transparent color="red" class="q-pa-xs">{{ props.row.discount }}%</q-badge>&nbsp;
                          <span
                            class="text-strike text-caption"
                          >Rp{{ formatPrice(props.row.price) }}</span>
                          <span
                            class="text-weight-bold text-subtitle2"
                          >&nbsp;Rp{{ formatPrice(props.row.price - (props.row.price * props.row.discount) / 100) }}</span>
                        </div>
                        <div v-else align="left">
                          <span
                            class="text-weight-bold text-subtitle2"
                          >&nbsp;Rp{{ formatPrice(props.row.price) }}</span>
                        </div>
                        <div align="left">
                          <span class="text-caption">Jumlah:{{ props.row.qty }}&nbsp;Barang</span>
                        </div>
                      </div>
                      <div class="col-3" align="right">
                        <span
                          class="text-weight-bold text-subtitle2"
                        >&nbsp;Rp{{ formatPrice((props.row.price - (props.row.price * props.row.discount) / 100) * props.row.qty) }}</span>
                      </div>
                    </div>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
            <q-separator />
            <div class="row q-pa-md">
              <div class="col-9 text-weight-bold">Total</div>
              <div
                class="col-3 text-weight-bold"
                align="right"
              >Rp {{formatPrice(sumPrice - sumDisc)}}</div>
            </div>
          </div>
          <div class="col-3">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-weight-bold text-h6">Pilih Kurir</div>
              </q-card-section>
              <q-card-section>
                <q-select
                  dense
                  bottom-slots
                  v-model="forminsert.idcourier"
                  :options="dataCourier"
                  option-value="id"
                  option-label="courier"
                  emit-value
                  map-options
                  :error="$v.forminsert.idcourier.$error"
                  error-message="Pilih Kurir"
                >
                  <template
                    v-slot:selected-item="scope"
                  >{{ scope.opt.courier }} {{ scope.opt.courierdesc }}</template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                      <q-item-section>
                        <q-item-label>{{ scope.opt.courier }} - {{ scope.opt.courierdesc }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </q-card-section>
              <q-card-section>
                <q-btn
                  unelevated
                  no-caps
                  color="primary"
                  class="full-width"
                  label="Proses"
                  @click="onInsert()"
                />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
    <q-dialog v-model="windUpdateQTY" transition-show="none" transition-hide="none">
      <q-card class="q-pa-none" style="width:260px">
        <q-toolbar class="bgtitle">
          <q-toolbar-title>Jumlah Barang</q-toolbar-title>
        </q-toolbar>
        <q-card-section>
          <div class="row items-center text-center">
            <div class="col-2">
              <q-btn
                no-caps
                flat
                color="primary"
                padding="none"
                icon="remove"
                @click="removeQTY()"
              />
            </div>
            <div class="col-4">
              <q-input
                dense
                readonly
                outlined
                maxlength="50"
                input-class="text-center"
                v-model="forminsert.qty"
                mask="###"
              ></q-input>
            </div>
            <div class="col-2">
              <q-btn no-caps flat color="primary" padding="none" icon="add" @click="addQTY()" />
            </div>
            <div class="col-4">
              <span class="text-subtitle2">Stok</span>
              <span class="text-subtitle2 text-weight-bold">&nbsp;{{ forminsert.stock }}</span>
            </div>
          </div>
        </q-card-section>
        <q-card-section align="right">
          <q-btn-group flat>
            <q-btn unelevated no-caps color="primary" label="Update" @click="onUpdateQTY()" />
          </q-btn-group>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="windUpdateRemark" transition-show="none" transition-hide="none">
      <q-card class="q-pa-none" style="width:360px">
        <q-toolbar class="bgtitle">
          <q-toolbar-title>Catatan</q-toolbar-title>
        </q-toolbar>
        <q-card-section>
          <q-input dense outlined counter maxlength="20" v-model="forminsert.remark"></q-input>
        </q-card-section>
        <q-card-section align="right">
          <q-btn-group flat>
            <q-btn unelevated no-caps color="primary" label="Update" @click="onUpdateRemark()" />
          </q-btn-group>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'
const columns = [
  {
    name: 'productname',
    required: true,
    label: 'PRODUK',
    align: 'left',
    field: 'productname',
    sortable: false,
    headerClasses: 'bgtable'
  }
]
export default {
  name: 'Checkout',
  preFetch ({ store }) {},
  data () {
    return {
      columns,
      windUpdateQTY: false,
      windUpdateRemark: false,
      qty: 1,
      pagination: {
        sortBy: 'name',
        descending: false,
        page: 0,
        rowsPerPage: 0
      },
      forminsert: {
        iduser: '',
        idcourier: ''
      }
    }
  },
  validations: {
    forminsert: {
      idcourier: { required }
    }
  },
  computed: {
    ...mapState({
      dataConfig: (state) => state.configs.config,
      dataCart: (state) => state.carts.cart,
      dataCourier: (state) => state.couriers.courier
    }),
    ...mapGetters({
      dataUser: 'auth/user',
      loggedIn: 'auth/loggedIn'
    }),
    sumPrice () {
      return this.dataCart.reduce((sum, total) => {
        return (sum += parseFloat(total.price) * total.qty)
      }, 0)
    },
    sumDisc () {
      return this.dataCart.reduce((sum, total) => {
        return (
          (sum +=
            (parseFloat(total.price) * parseFloat(total.discount)) / 100) *
          total.qty
        )
      }, 0)
    }
  },
  mounted () {
    this.$store.dispatch('carts/getcart', this.dataUser.id)
  },
  methods: {
    addQTY () {
      const QTY = this.forminsert.qty + 1
      if (QTY > this.forminsert.stock) {
        this.forminsert.qty = this.forminsert.stock
      } else {
        this.forminsert.qty = QTY
      }
    },
    removeQTY () {
      const QTY = this.forminsert.qty - 1
      if (QTY < 1) {
        this.forminsert.qty = 1
      } else {
        this.forminsert.qty = QTY
      }
    },
    formatPrice (value) {
      const val = (value / 1).toFixed(0).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    dispWindQTY (data) {
      Promise.all([
        (this.forminsert = Object.assign(this.forminsert, data)),
        (this.forminsert.iduser = this.dataUser.id)
      ]).finally(() => {
        this.windUpdateQTY = true
      })
    },
    dispWindRemark (data) {
      Promise.all([
        (this.forminsert = Object.assign(this.forminsert, data)),
        (this.forminsert.iduser = this.dataUser.id)
      ]).finally(() => {
        this.windUpdateRemark = true
      })
    },
    onUpdateQTY () {
      this.$store.dispatch('carts/updateqty', this.forminsert)
      this.windUpdateQTY = false
    },
    onUpdateRemark () {
      this.$store.dispatch('carts/updateremark', this.forminsert)
      this.windUpdateRemark = false
    },
    onDeletecart (id, iduser) {
      this.$store
        .dispatch('carts/deletecart', [id, iduser])
        .then(() => {
          this.$q.notify({
            position: 'top',
            color: 'positive',
            textColor: 'white',
            timeout: 2500,
            icon: 'done',
            message: 'Produk telah dihapus dari Keranjang!'
          })
          this.windRegister = false
        })
        .catch(() => {
          this.$q.notify({
            position: 'bottom-right',
            color: 'negative',
            textColor: 'white',
            timeout: 2500,
            icon: 'error_outline',
            message: 'Produk gagal dihapus dari Keranjang!'
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    onInsert () {
      this.$v.forminsert.$touch()
      this.forminsert.iduser = this.dataUser.id
      if (!this.$v.forminsert.$error) {
        this.loading = true
        this.$store
          .dispatch('transactions/updatecourier', this.forminsert)
          .then(() => {
            this.$q.notify({
              position: 'top',
              color: 'positive',
              textColor: 'white',
              timeout: 2500,
              icon: 'done',
              message: 'Transaksi telah diproses!'
            })
            this.$store.dispatch('carts/getcart', this.dataUser.id)
            this.$router.push({
              name: 'transaction'
            })
          })
          .catch((error) => {
            if (error.response) {
              this.$q.notify({
                position: 'bottom-right',
                color: 'negative',
                textColor: 'white',
                timeout: 3500,
                icon: 'error_outline',
                message: 'Transaksi gagal diproses!'
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
