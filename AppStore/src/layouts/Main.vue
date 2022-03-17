<template>
  <q-layout v-if="dataConfig" view="hHh LpR fFf" class="non-selectable">
    <q-header class="bgheader" bordered>
      <q-toolbar>
        <q-avatar rounded size="42px" class="cursor-pointer" @click="drawerMenu = !drawerMenu">
          <img :src="$apiURL + '/images/logo.png'" />
        </q-avatar>
        <q-toolbar-title class="wrap text-h6 cursor-pointer">{{ this.dataConfig.corporatename }}</q-toolbar-title>
        <q-space />
        <q-btn
          v-if="dataUser"
          unelevated
          no-caps
          color="primary"
          :label="dataUser.name"
          :to="{ name:'config'}"
        ></q-btn>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>

    <q-drawer v-model="drawerMenu" :width="240" no-swipe-open bordered>
      <q-scroll-area class="fit">
        <q-bar class="text-weight-medium text-subtitle2 bg-transparent">ADMINISTRASI</q-bar>
        <q-list dense>
          <q-item clickable :to="{ name:'product'}" active-class="menu-link" class="menutext">
            <q-item-section avatar>
              <q-icon name="dashboard" />
            </q-item-section>
            <q-item-section>Produk</q-item-section>
          </q-item>
        </q-list>
        <q-list dense>
          <q-item clickable active-class="menu-link" class="menutext" @click="toOrder()">
            <q-item-section avatar>
              <q-icon v-if="dataNotification.transaction == true" name="o_local_mall" color="red" />
              <q-icon v-else name="o_local_mall"></q-icon>
            </q-item-section>
            <q-item-section>Pesanan</q-item-section>
          </q-item>
        </q-list>
        <q-bar class="text-weight-medium text-subtitle2 bg-transparent">LAPORAN</q-bar>
        <q-list dense>
          <q-item
            clickable
            :to="{ name:'reptransaction'}"
            active-class="menu-link"
            class="menutext"
          >
            <q-item-section avatar>
              <q-icon name="filter_none" />
            </q-item-section>
            <q-item-section>Transaksi</q-item-section>
          </q-item>
        </q-list>
        <q-bar class="text-weight-bold text-subtitle2 bg-transparent">PENGATURAN</q-bar>
        <q-list dense>
          <q-item clickable :to="{ name:'category'}" active-class="menu-link" class="menutext">
            <q-item-section avatar>
              <q-icon name="o_space_dashboard" />
            </q-item-section>
            <q-item-section>Kategori Produk</q-item-section>
          </q-item>
        </q-list>
        <q-list dense>
          <q-item clickable :to="{ name:'bank'}" active-class="menu-link" class="menutext">
            <q-item-section avatar>
              <q-icon name="o_domain" />
            </q-item-section>
            <q-item-section>Bank Transfer</q-item-section>
          </q-item>
        </q-list>
        <q-list dense>
          <q-item clickable :to="{ name:'courier'}" active-class="menu-link" class="menutext">
            <q-item-section avatar>
              <q-icon name="o_local_shipping" />
            </q-item-section>
            <q-item-section>Jasa Pengiriman / Kurir</q-item-section>
          </q-item>
        </q-list>
        <q-list dense>
          <q-item clickable :to="{ name:'config'}" active-class="menu-link" class="menutext">
            <q-item-section avatar>
              <q-icon name="handyman" />
            </q-item-section>
            <q-item-section>Website</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>
  </q-layout>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'Main',
  preFetch ({ store }) {},
  data () {
    return {
      drawerMenu: true,
      darktheme: false,
      version: null
    }
  },
  mounted () {
    this.countDownTimer()
  },
  computed: {
    ...mapGetters({
      loggedIn: 'auth/loggedIn'
    }),
    ...mapState({
      dataConfig: (state) => state.configs.config,
      dataLoad: (state) => state.configs.loadstate,
      dataServerDate: (state) => state.configs.serverdate,
      dataNotification: (state) => state.transactions.notification,
      dataUser: (state) => state.auth.user
    })
  },
  methods: {
    countDownTimer () {
      setTimeout(() => {
        if (this.loggedIn) {
          this.$store.dispatch('transactions/getnotification', this.dataUser.id)
        }
        this.countDownTimer()
      }, 30000)
    },
    toOrder () {
      this.$store.dispatch('transactions/removenotification', this.dataUser.id)
      this.$store.dispatch('transactions/getalltransaction')
      this.$router.push({ name: 'order' }).catch(() => {})
    },
    onLogout () {
      this.loadingsignout = true
      this.$store
        .dispatch('auth/logout')
        .then(() => {
          this.$router.push({ name: 'login' })
        })
        .catch((error) => {
          if (error.response.status === 401) {
            this.$router.push({ name: 'login' })
          }
        })
        .finally(() => {
          this.loadingsignout = false
        })
    }
  }
}
</script>
