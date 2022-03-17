<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  preFetch ({ store, redirect }) {
    redirect(false)
    store
      .dispatch('auth/fetch')
      .then(() => {
        redirect(true)
      })
      .catch(() => {
        store.dispatch('auth/cleartoken')
        redirect({ path: '/' })
      })
  }
}
</script>
