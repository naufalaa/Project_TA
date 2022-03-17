<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { LocalStorage, Dark } from 'quasar'
import { api } from 'boot/axios'

export default {
  name: 'App',
  preFetch ({ store, redirect }) {
    store.dispatch('configs/config')
    store.dispatch('regions/getregion')
    redirect(false)
    api.interceptors.response.use(
      function (response) {
        return response
      },
      function (error) {
        if (error.response.status === 401) {
          redirect({ name: 'login' })
          store.dispatch('auth/cleartoken')
        } else {
          return Promise.reject(error)
        }
      }
    )
    const dark = LocalStorage.getItem('dark')
    if (dark !== null) {
      if (dark === true) {
        Dark.set(true)
      } else {
        Dark.set(false)
      }
    } else {
      LocalStorage.set('dark', true)
      Dark.set(true)
    }
    store
      .dispatch('auth/fetch')
      .then(() => {
        redirect({ name: 'config' })
      })
      .catch(() => {
        store.dispatch('auth/cleartoken')
        redirect({ name: 'login' })
      })
  }
}
</script>
