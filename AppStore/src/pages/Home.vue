<template>
  <q-page>
    <q-toolbar class="q-pl-md q-pr-md bgtitle">
      <q-icon name="home" class="menu-icon" />
      <q-toolbar-title>HOME</q-toolbar-title>
    </q-toolbar>
    <q-separator />
    <q-scroll-area style="height: calc(100vh - 102px);"></q-scroll-area>
  </q-page>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  data () {
    return {
      loading: false
    }
  },
  computed: {
    ...mapState({
      dataConfig: (state) => state.configs.config
    }),
    ...mapGetters({
      dataUser: 'auth/user',
      loggedIn: 'auth/loggedIn'
    })
  },
  mounted () {},
  methods: {}
}
</script>
