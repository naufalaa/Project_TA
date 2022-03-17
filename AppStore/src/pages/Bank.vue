<template>
  <q-page>
    <q-toolbar class="q-pl-md q-pr-md bgtitle">
      <q-icon name="o_domain" size="sm" />
      <q-toolbar-title>
        <span class="text-primary">PENGATURAN</span> BANK TRANSFER
      </q-toolbar-title>
      <q-space />
      <q-input dense debounce="300" v-model="filter" input-class="text-uppercase" maxlength="20">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-btn-group flat class="q-ml-sm">
        <q-btn flat dense color="primary" icon="add" @click="dispInsert()">
          <q-tooltip anchor="bottom middle" self="top end">TAMBAH BANK</q-tooltip>
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
              :data="dataBank"
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
                  <q-td auto-width key="bankname" :props="props">{{ props.row.bankname }}</q-td>
                  <q-td key="branch" :props="props">{{ props.row.branch }}</q-td>
                  <q-td key="accname" :props="props">{{ props.row.accname }}</q-td>
                  <q-td key="accnumber" :props="props">{{ props.row.accnumber }}</q-td>
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
          <q-toolbar-title>BANK TRANSFER</q-toolbar-title>
          <q-btn flat dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section>
          <q-input
            dense
            counter
            :value="forminsert.bankname"
            v-model="forminsert.bankname"
            label="Nama Bank"
            hint="Contoh: BANK BRI"
            maxlength="50"
            :error="$v.forminsert.bankname.$error"
            error-message="Nama Bank harus diisi"
            input-class="text-uppercase"
          ></q-input>
          <q-input
            dense
            counter
            :value="forminsert.branch"
            v-model="forminsert.branch"
            label="Cabang"
            hint="Contoh: INDRAMAYU"
            maxlength="50"
            :error="$v.forminsert.branch.$error"
            error-message="Nama Bank harus diisi"
            input-class="text-uppercase"
          ></q-input>
          <q-input
            dense
            counter
            :value="forminsert.accname"
            v-model="forminsert.accname"
            label="Nama Rekening"
            maxlength="50"
            :error="$v.forminsert.accname.$error"
            error-message="Nama Rekening harus diisi"
            input-class="text-uppercase"
          ></q-input>
          <q-input
            dense
            counter
            :value="forminsert.accnumber"
            v-model="forminsert.accnumber"
            label="Nomor Rekening"
            mask="####################"
            maxlength="20"
            :error="$v.forminsert.accnumber.$error"
            error-message="Nomor Rekening Bank harus diisi"
            input-class="text-uppercase"
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
          <q-toolbar-title>BANK TRANSFER</q-toolbar-title>
          <q-btn flat dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section>
          <q-input
            dense
            counter
            :value="formupdate.bankname"
            v-model="formupdate.bankname"
            label="Nama Bank"
            hint="Contoh: BANK BRI"
            maxlength="50"
            :error="$v.formupdate.bankname.$error"
            error-message="Nama Bank harus diisi"
            input-class="text-uppercase"
          ></q-input>
          <q-input
            dense
            counter
            :value="formupdate.branch"
            v-model="formupdate.branch"
            label="Cabang"
            hint="Contoh: INDRAMAYU"
            maxlength="50"
            :error="$v.formupdate.branch.$error"
            error-message="Nama Bank harus diisi"
            input-class="text-uppercase"
          ></q-input>
          <q-input
            dense
            counter
            :value="formupdate.accname"
            v-model="formupdate.accname"
            label="Nama Rekening"
            maxlength="50"
            :error="$v.formupdate.accname.$error"
            error-message="Nama Rekening harus diisi"
            input-class="text-uppercase"
          ></q-input>
          <q-input
            dense
            counter
            :value="formupdate.accnumber"
            v-model="formupdate.accnumber"
            label="Nomor Rekening"
            mask="####################"
            maxlength="20"
            :error="$v.formupdate.accnumber.$error"
            error-message="Nomor Rekening Bank harus diisi"
            input-class="text-uppercase"
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
          <q-toolbar-title>HAPUS BANK TRANSFER</q-toolbar-title>
          <q-btn padding="xs sm" unelevated icon="close" v-close-popup />
        </q-toolbar>
        <q-separator />
        <q-card-section class="text-info">Hapus BANK Transfer {{ this.formupdate.bankname }}?</q-card-section>
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
    store.dispatch('banks/getbank')
  },
  data () {
    return {
      loading: false,
      filter: '',
      windInsert: false,
      windUpdate: false,
      windDelete: false,
      forminsert: {
        bankname: '',
        branch: '',
        accname: '',
        accnumber: ''
      },
      formupdate: {
        id: '',
        bankname: '',
        branch: '',
        accname: '',
        accnumber: ''
      },
      columns: [
        {
          name: 'bankname',
          align: 'left',
          label: 'BANK',
          field: 'bankname',
          sortable: false,
          headerClasses: 'bgtable'
        },
        {
          name: 'branch',
          align: 'left',
          label: 'CABANG',
          field: 'branch',
          sortable: false,
          headerClasses: 'bgtable'
        },
        {
          name: 'accname',
          align: 'left',
          label: 'NAMA REKENING',
          field: 'accname',
          sortable: false,
          headerClasses: 'bgtable'
        },
        {
          name: 'accnumber',
          align: 'left',
          label: 'NOMOR REKENING',
          field: 'accnumber',
          sortable: false,
          headerClasses: 'bgtable'
        },
        { name: 'actions', align: 'right', label: '', headerClasses: 'bgtable' }
      ]
    }
  },
  validations: {
    forminsert: {
      bankname: { required },
      branch: { required },
      accname: { required },
      accnumber: { required }
    },
    formupdate: {
      bankname: { required },
      branch: { required },
      accname: { required },
      accnumber: { required }
    }
  },
  computed: {
    ...mapState({
      dataConfig: (state) => state.configs.config,
      dataBank: (state) => state.banks.bank,
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
        (this.forminsert.bankname = ''),
        (this.forminsert.branch = ''),
        (this.forminsert.accname = ''),
        (this.forminsert.accnumber = '')
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
    dispDelete () {
      this.windDelete = true
    },
    onInsert () {
      this.$v.forminsert.$touch()
      if (!this.$v.forminsert.$error) {
        this.loading = true
        this.$store
          .dispatch('banks/insertbank', this.forminsert)
          .then(() => {
            this.$q.notify({
              position: 'bottom-right',
              color: 'positive',
              textColor: 'white',
              timeout: 2500,
              icon: 'done',
              message: 'BANK TRANSFER berhasil disimpan!'
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
              message: 'BANK TRANSFER gagal disimpan!'
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
          .dispatch('banks/updatebank', this.formupdate)
          .then(() => {
            this.$q.notify({
              position: 'bottom-right',
              color: 'positive',
              textColor: 'white',
              timeout: 2500,
              icon: 'done',
              message: 'BANK TRANSFER berhasil diupdate!'
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
              message: 'BANK TRANSFER gagal diupdate!'
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
