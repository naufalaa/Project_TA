<template>
  <q-card flat bordered style="width:580px" class="q-pa-none absolute-center">
    <q-toolbar class="bgtitle">
      <q-avatar rounded size="42px" class="cursor-pointer" @click="drawerMenu = !drawerMenu">
        <img :src="$apiURL + '/images/logo.png'" />
      </q-avatar>
      <q-toolbar-title class="wrap text-h6 bgheader">Admin&nbsp;{{ this.dataConfig.corporatename }}</q-toolbar-title>
    </q-toolbar>
    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col-5">
          <q-img :src="$apiURL + '/images/logo.png'" />
        </div>
        <div class="col-7">
          <q-card flat bordered>
            <q-card-section>
              <q-input
                dense
                v-model="formlogin.email"
                label="Email"
                maxlength="100"
                :error="$v.formlogin.email.$error"
                error-message="Email harus diisi"
              >
                <template v-slot:prepend>
                  <q-icon name="o_email" />
                </template>
              </q-input>
              <q-input
                dense
                v-model="formlogin.password"
                type="password"
                label="Password"
                maxlength="50"
                :error="$v.formlogin.password.$error"
                error-message="Password harus diisi"
              >
                <template v-slot:prepend>
                  <q-icon name="o_lock" />
                </template>
              </q-input>
            </q-card-section>
          </q-card>
          <br />
          <div align="right">
            <q-btn
              no-caps
              unelevated
              color="primary"
              label="Log in"
              :loading="loading"
              @click="onLogin()"
            />
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
import { mapState } from 'vuex'
export default {
  name: 'Login',
  data () {
    return {
      loading: false,
      darktheme: false,
      formlogin: {
        email: '',
        password: ''
      }
    }
  },
  validations: {
    formlogin: {
      email: { required, email },
      password: { required }
    }
  },
  computed: {
    ...mapState({ dataConfig: (state) => state.configs.config })
  },
  mounted () {},
  methods: {
    async nextTab (next) {
      await this.$nextTick()
      this.$refs[next].$el.focus()
    },
    onLogin () {
      this.$v.formlogin.$touch()
      if (!this.$v.formlogin.$error) {
        this.loading = true
        this.$store
          .dispatch('auth/login', this.formlogin)
          .then(() => {
            this.$router.push({ name: 'config' })
          })
          .catch((error) => {
            if (error.response) {
              this.$q.notify({
                position: 'bottom-right',
                color: 'negative',
                textColor: 'white',
                timeout: 3500,
                icon: 'error_outline',
                message: 'Sign In FAILED! Periksa ID atau Password!'
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
