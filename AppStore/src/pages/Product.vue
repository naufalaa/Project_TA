<template>
  <q-page>
    <q-toolbar class="q-pl-md q-pr-md bgtitle">
      <q-icon name="dashboard" size="sm" />
      <q-toolbar-title>
        <span class="text-primary">ADMINISTRASI</span> PRODUK
      </q-toolbar-title>
      <q-space />
      <q-input dense debounce="300" v-model="filter" input-class="text-uppercase" maxlength="20">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-btn-group flat class="q-ml-sm">
        <q-btn flat dense color="primary" icon="add" @click="dispInsert()">
          <q-tooltip anchor="bottom middle" self="top end">TAMBAH PRODUK</q-tooltip>
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
              :data="dataProduct"
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
                  <q-td auto-width key="productname" :props="props">{{ props.row.productname }}</q-td>
                  <q-td key="category" :props="props">{{ props.row.category }}</q-td>
                  <q-td key="price" :props="props">{{ formatDecimal(props.row.price) }}</q-td>
                  <q-td key="discount" :props="props">{{ props.row.discount }}%</q-td>
                  <q-td key="stock" :props="props">{{ props.row.stock }}</q-td>
                  <q-td key="weight" :props="props">{{ props.row.weight }} Gram</q-td>
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

    <q-dialog
      v-model="windInsert"
      persistent
      full-height
      full-width
      transition-show="none"
      transition-hide="none"
    >
      <q-card class="q-pa-none">
        <q-toolbar>
          <q-avatar square>
            <q-icon name="add" class="menu-icon" size="sm" />
          </q-avatar>
          <q-toolbar-title>TAMBAH PRODUK</q-toolbar-title>
          <q-btn flat dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <div class="menutext text-weight-bold">Informasi Produk</div>
              <div class="row q-col-gutter-sm">
                <div class="col-12">
                  <q-input
                    dense
                    counter
                    :value="forminsert.productname"
                    v-model="forminsert.productname"
                    label="Produk"
                    hint="Nama Produk"
                    maxlength="100"
                    :error="$v.forminsert.productname.$error"
                    error-message="Nama Produk harus diisi"
                  ></q-input>
                </div>
                <div class="col-12">
                  <q-select
                    dense
                    bottom-slots
                    v-model="forminsert.idcategory"
                    :options="dataCategory"
                    option-value="id"
                    option-label="category"
                    emit-value
                    map-options
                    label="Kategori"
                    hint="Pilih Kategori"
                    :error="$v.forminsert.idcategory.$error"
                    error-message="Pilih Kategori Produk"
                  ></q-select>
                </div>
              </div>
              <div class="row q-col-gutter-sm">
                <div class="col-6">
                  <q-input
                    dense
                    :value="forminsert.nominal"
                    v-model="forminsert.nominal"
                    label="Harga"
                    hint="Harga Produk"
                    ref="nominal"
                    :error="$v.forminsert.nominal.$error"
                    error-message="Harga Produk harus di isi!"
                    v-currency="options"
                    input-class="text-right"
                    @focus="$event.target.select()"
                  ></q-input>
                </div>
                <div class="col-6">
                  <q-input
                    dense
                    bottom-slots
                    :value="forminsert.discount"
                    v-model="forminsert.discount"
                    label="Diskon"
                    suffix="%"
                    hint="Potongan Harga Produk"
                    mask="##"
                    input-class="text-right"
                    @focus="$event.target.select()"
                  ></q-input>
                </div>
              </div>
              <div class="row q-col-gutter-sm">
                <div class="col-6">
                  <q-input
                    dense
                    bottom-slots
                    :value="forminsert.stock"
                    v-model="forminsert.stock"
                    label="Stok"
                    hint="Stok Produk"
                    mask="#####"
                    :error="$v.forminsert.stock.$error"
                    error-message="Stok Produk harus diisi"
                    input-class="text-right"
                    @focus="$event.target.select()"
                  ></q-input>
                </div>
                <div class="col-6">
                  <q-input
                    dense
                    bottom-slots
                    :value="forminsert.weight"
                    v-model="forminsert.weight"
                    label="Berat"
                    hint="Berat Produk dalam Gram"
                    mask="#####"
                    :error="$v.forminsert.weight.$error"
                    error-message="Stok Produk harus diisi"
                    input-class="text-right"
                    @focus="$event.target.select()"
                  ></q-input>
                </div>
              </div>
              <div class="col-6 q-pt-md">
                <div class="menutext text-weight-bold">Detail Produk</div>
                <q-editor
                  square
                  v-model="forminsert.productdesc"
                  min-height="5rem"
                  ref="editor_ref"
                  @paste.native="evt => pasteCapture(evt)"
                  :error="$v.forminsert.productdesc.$error"
                  error-message="Detail Produk harus diisi"
                  :toolbar="[
                            ['bold', 'italic', 'strike', 'underline']
                          ]"
                ></q-editor>
              </div>
            </div>
            <div class="col-6">
              <div class="menutext text-weight-bold">Gambar Produk</div>
              <div
                class="menutext"
              >Format gambar .jpg .jpeg .png dan ukuran minimum 300 x 300px, Untuk gambar optimal gunakan gambar dengan ukuran 512 x 512px.</div>
              <div class="row q-col-gutter-sm">
                <div class="col-2" v-for="(item,i) in items" :key="'inputImg' + i">
                  <div v-if="i==0" align="center">Gambar Utama</div>
                  <div v-else align="center">Gambar {{ i+1 }}</div>
                  <q-card
                    v-if="!item.image"
                    flat
                    bordered
                    class="q-pa-none cursor-pointer"
                    @click="onLoadimage()"
                    style="height: 100px; width: 100px"
                  >
                    <input
                      hidden
                      type="file"
                      id="insertImg"
                      name="insertImg"
                      accept="image/x-png, image/jpeg"
                      @change="onFileChange(item, $event)"
                    />
                    <q-img src="~assets/addimage.png" :ratio="1" />
                  </q-card>
                  <q-card
                    v-else
                    flat
                    bordered
                    class="q-pa-none"
                    style="height: 100px; width: 100px"
                  >
                    <q-img :src="item.image" :ratio="1">
                      <div class="absolute-center bg-transparent q-pa-none">
                        <q-btn
                          dense
                          unelevated
                          color="primary"
                          icon="delete"
                          @click="removeImage(item)"
                        />
                      </div>
                    </q-img>
                  </q-card>
                </div>
              </div>
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
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

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
          <q-toolbar-title>UPDATE PRODUK</q-toolbar-title>
          <q-btn flat dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <div class="menutext text-weight-bold">Informasi Produk</div>
              <div class="row q-col-gutter-sm">
                <div class="col-12">
                  <q-input
                    dense
                    counter
                    :value="formupdate.productname"
                    v-model="formupdate.productname"
                    label="Produk"
                    hint="Nama Produk"
                    maxlength="100"
                    :error="$v.formupdate.productname.$error"
                    error-message="Nama Produk harus diisi"
                  ></q-input>
                </div>
                <div class="col-12">
                  <q-select
                    dense
                    bottom-slots
                    v-model="formupdate.idcategory"
                    :options="dataCategory"
                    option-value="id"
                    option-label="category"
                    emit-value
                    map-options
                    label="Kategori"
                    hint="Pilih Kategori"
                    :error="$v.formupdate.idcategory.$error"
                    error-message="Pilih Kategori Produk"
                  ></q-select>
                </div>
              </div>
              <div class="row q-col-gutter-sm">
                <div class="col-6">
                  <q-input
                    dense
                    :value="formupdate.nominal"
                    v-model="formupdate.nominal"
                    label="Harga"
                    hint="Harga Produk"
                    ref="nominalupdate"
                    :error="$v.formupdate.nominal.$error"
                    error-message="Harga Produk harus di isi!"
                    v-currency="options"
                    input-class="text-right"
                    @focus="$event.target.select()"
                  ></q-input>
                </div>
                <div class="col-6">
                  <q-input
                    dense
                    bottom-slots
                    :value="formupdate.discount"
                    v-model="formupdate.discount"
                    label="Diskon"
                    suffix="%"
                    hint="Potongan Harga Produk"
                    mask="##"
                    input-class="text-right"
                    @focus="$event.target.select()"
                  ></q-input>
                </div>
              </div>
              <div class="row q-col-gutter-sm">
                <div class="col-6">
                  <q-input
                    dense
                    bottom-slots
                    :value="formupdate.stock"
                    v-model="formupdate.stock"
                    label="Stok"
                    hint="Stok Produk"
                    mask="#####"
                    :error="$v.formupdate.stock.$error"
                    error-message="Stok Produk harus diisi"
                    input-class="text-right"
                    @focus="$event.target.select()"
                  ></q-input>
                </div>
                <div class="col-6">
                  <q-input
                    dense
                    bottom-slots
                    :value="formupdate.weight"
                    v-model="formupdate.weight"
                    label="Berat"
                    hint="Berat Produk dalam Gram"
                    mask="#####"
                    :error="$v.formupdate.weight.$error"
                    error-message="Berat Produk harus diisi"
                    input-class="text-right"
                    @focus="$event.target.select()"
                  ></q-input>
                </div>
              </div>
              <div class="col-6">
                <div class="menutext text-weight-bold">Detail Produk</div>
                <q-editor
                  square
                  v-model="formupdate.productdesc"
                  min-height="5rem"
                  ref="editor_ref"
                  @paste.native="evt => pasteCapture(evt)"
                  :error="$v.formupdate.productdesc.$error"
                  error-message="Detail Produk harus diisi"
                  :toolbar="[
                            ['bold', 'italic', 'strike', 'underline']
                          ]"
                ></q-editor>
              </div>
            </div>
            <div class="col-6">
              <div class="menutext text-weight-bold">Gambar Produk</div>
              <div
                class="menutext"
              >Format gambar .jpg .jpeg .png dan ukuran minimum 300 x 300px, Untuk gambar optimal gunakan gambar dengan ukuran 512 x 512px.</div>
              <div class="row q-col-gutter-sm">
                <div class="col-2" v-for="(item,i) in items" :key="'inputImg' + i">
                  <div v-if="i==0" align="center">Gambar Utama</div>
                  <div v-else align="center">Gambar {{ i+1 }}</div>
                  <q-card
                    v-if="!item.image"
                    flat
                    bordered
                    class="q-pa-none cursor-pointer"
                    @click="onLoadimage()"
                    style="height: 100px; width: 100px"
                  >
                    <input
                      hidden
                      type="file"
                      id="insertImg"
                      name="insertImg"
                      accept="image/x-png, image/jpeg"
                      @change="onFileChange(item, $event)"
                    />
                    <q-img src="~assets/addimage.png" :ratio="1" />
                  </q-card>
                  <q-card
                    v-else
                    flat
                    bordered
                    class="q-pa-none"
                    style="height: 100px; width: 100px"
                  >
                    <q-img :src="item.image" :ratio="1">
                      <div class="absolute-center bg-transparent q-pa-none">
                        <q-btn
                          dense
                          unelevated
                          color="primary"
                          icon="delete"
                          @click="removeImage(item)"
                        />
                      </div>
                    </q-img>
                  </q-card>
                </div>
              </div>
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
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="windDelete" persistent transition-show="none" transition-hide="none">
      <q-card class="q-pa-none" style="width:420px">
        <q-toolbar>
          <q-avatar square>
            <q-icon name="delete" class="menu-icon" size="sm" />
          </q-avatar>
          <q-toolbar-title>HAPUS PRODUK</q-toolbar-title>
          <q-btn padding="xs sm" unelevated icon="close" v-close-popup />
        </q-toolbar>
        <q-separator />
        <q-card-section class="text-info">Hapus Produk {{ this.formupdate.productname }}?</q-card-section>
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
import { CurrencyDirective, getValue } from 'vue-currency-input'
import { date } from 'quasar'
export default {
  name: 'Product',

  preFetch ({ store }) {
    store.dispatch('products/getproduct')
    store.dispatch('categories/getcategory')
  },
  directives: {
    currency: CurrencyDirective
  },
  data () {
    return {
      document,
      images: [],
      loading: false,
      filter: '',
      windInsert: false,
      windUpdate: false,
      windDelete: false,
      forminsert: {
        productname: '',
        idcategory: '',
        productdesc: '',
        nominal: 0,
        price: 0,
        discount: 0,
        stock: 0,
        weight: 0
      },
      formupdate: {
        id: '',
        productname: '',
        idcategory: '',
        productdesc: '',
        nominal: 0,
        price: 0,
        discount: 0,
        stock: 0,
        weight: 0
      },
      items: [
        {
          file: null,
          image: false
        },
        {
          file: null,
          image: false
        },
        {
          file: null,
          image: false
        },
        {
          file: null,
          image: false
        },
        {
          file: null,
          image: false
        }
      ],
      columns: [
        {
          name: 'productname',
          align: 'left',
          label: 'NAMA PRODUK',
          field: 'productname',
          sortable: false,
          headerClasses: 'bgtable'
        },
        {
          name: 'category',
          align: 'left',
          label: 'KATEGORI',
          field: 'category',
          sortable: false,
          headerClasses: 'bgtable'
        },
        {
          name: 'price',
          align: 'right',
          label: 'HARGA',
          field: 'price',
          sortable: false,
          headerClasses: 'bgtable'
        },
        {
          name: 'discount',
          align: 'right',
          label: 'DISKON',
          field: 'discount',
          sortable: false,
          headerClasses: 'bgtable'
        },
        {
          name: 'stock',
          align: 'right',
          label: 'STOK',
          field: 'stock',
          sortable: false,
          headerClasses: 'bgtable'
        },
        {
          name: 'weight',
          align: 'right',
          label: 'BERAT',
          field: 'weight',
          sortable: false,
          headerClasses: 'bgtable'
        },
        { name: 'actions', align: 'right', label: '', headerClasses: 'bgtable' }
      ]
    }
  },
  validations: {
    forminsert: {
      productname: { required },
      idcategory: { required },
      productdesc: { required },
      nominal: { required },
      stock: { required },
      weight: { required }
    },
    formupdate: {
      productname: { required },
      idcategory: { required },
      productdesc: { required },
      nominal: { required },
      stock: { required },
      weight: { required }
    }
  },
  computed: {
    options () {
      return {
        locale: undefined,
        currency: null
      }
    },
    ...mapState({
      dataConfig: (state) => state.configs.config,
      dataProduct: (state) => state.products.product,
      dataImgproduct: (state) => state.products.imgproduct,
      dataCategory: (state) => state.categories.category,
      dataUser: (state) => state.auth.user
    })
  },
  mounted () {},
  methods: {
    pasteCapture (evt) {
      let text, onPasteStripFormattingIEPaste
      evt.preventDefault()
      if (evt.originalEvent && evt.originalEvent.clipboardData.getData) {
        text = evt.originalEvent.clipboardData.getData('text/plain')
        this.$refs.editor_ref.runCmd('insertText', text)
      } else if (evt.clipboardData && evt.clipboardData.getData) {
        text = evt.clipboardData.getData('text/plain')
        this.$refs.editor_ref.runCmd('insertText', text)
      } else if (window.clipboardData && window.clipboardData.getData) {
        if (!onPasteStripFormattingIEPaste) {
          onPasteStripFormattingIEPaste = true
          this.$refs.editor_ref.runCmd('ms-pasteTextOnly', text)
        }
        onPasteStripFormattingIEPaste = false
      }
    },
    onLoadimage () {
      document.getElementById('insertImg').click()
    },
    onFileChange (item, e) {
      const files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }
      this.createImage(item, files[0])
    },
    createImage (item, file) {
      const reader = new FileReader()

      reader.onload = (e) => {
        item.file = file
        item.image = e.target.result
      }
      reader.readAsDataURL(file)
    },
    removeImage (item) {
      item.file = null
      item.image = false
    },
    updateImage (responseAsBlob) {
      const imgUrl = URL.createObjectURL(responseAsBlob)
      const imageEl = document.createElement('img')
      imageEl.src = imgUrl
      document.body.appendChild(imageEl)
    },
    formatDate (fdate) {
      const formattedString = date.formatDate(fdate, 'DD-MM-YYYY')
      return formattedString
    },
    formatDecimal (IDR) {
      const val = (Math.abs(IDR) / 1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    clearFile () {
      for (let i = 0; i < this.items.length; i++) {
        this.items[i].file = null
        this.items[i].image = false
      }
    },
    dispInsert () {
      this.$v.$reset()
      this.clearFile()
      this.forminsert.productname = ''
      this.forminsert.idcategory = ''
      this.forminsert.productdesc = ''
      this.forminsert.nominal = 0
      this.forminsert.price = 0
      this.forminsert.discount = 0
      this.forminsert.stock = 0
      this.forminsert.weight = 0
      this.images = null
      this.windInsert = true
    },
    dispUpdate (data) {
      this.$v.$reset()
      this.clearFile()
      this.formupdate = Object.assign(this.formupdate, data)
      this.formupdate.nominal = this.formupdate.price
      Promise.all([
        this.$store.dispatch('products/getimgproduct', data.id)
      ]).finally(() => {
        for (let i = 0; i < this.dataImgproduct.length; i++) {
          this.$store
            .dispatch('products/getimgurl', this.dataImgproduct[i].imgname)
            .then((response) => {
              const fileURL = window.URL.createObjectURL(
                new Blob([response.data])
              )
              const file = new File(
                [response.data],
                this.dataImgproduct[i].imgname,
                {
                  type: [response.data].type
                }
              )
              this.items[i].file = file
              this.items[i].image = fileURL
            })
        }
        this.windUpdate = true
      })
    },
    onInsert () {
      this.$v.forminsert.$touch()
      if (!this.$v.forminsert.$error) {
        this.loading = true
        this.forminsert.price = getValue(this.$refs.nominal)
        const fd = new FormData()
        fd.append('data', JSON.stringify(this.forminsert))
        for (let i = 0; i < this.items.length; i++) {
          const file = this.items[i].file
          fd.append('imgfile[' + i + ']', file)
        }
        this.$store
          .dispatch('products/insertproduct', fd)
          .then(() => {
            this.$q.notify({
              position: 'bottom-right',
              color: 'positive',
              textColor: 'white',
              timeout: 2500,
              icon: 'done',
              message: 'PRODUK berhasil disimpan!'
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
              message: 'PRODUK gagal disimpan!'
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
        this.formupdate.price = getValue(this.$refs.nominalupdate)
        const fd = new FormData()
        fd.append('data', JSON.stringify(this.formupdate))
        for (let i = 0; i < this.items.length; i++) {
          const file = this.items[i].file
          fd.append('imgfile[' + i + ']', file)
        }
        this.$store
          .dispatch('products/updateproduct', fd)
          .then(() => {
            this.$q.notify({
              position: 'bottom-right',
              color: 'positive',
              textColor: 'white',
              timeout: 2500,
              icon: 'done',
              message: 'PRODUK berhasil diupdate!'
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
              message: 'PRODUK gagal diupdate!'
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
        .dispatch('products/deleteproduct', this.formupdate)
        .then(() => {
          this.$q.notify({
            position: 'bottom-right',
            color: 'positive',
            textColor: 'white',
            timeout: 2500,
            icon: 'done',
            message: 'PRODUK telah dihapus!'
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
            message: 'PRODUK gagal dihapus!'
          })
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style>
.filepond--panel-root {
  background-color: #eee;
}
.filepond--root {
  height: 260px;
}
.filepond--item {
  width: calc(20% - 1em);
}
</style>
