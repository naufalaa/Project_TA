import { api } from 'boot/axios'
import { LocalStorage } from 'quasar'

export function resetpassword (state, data) {
  return api.post('/auth/resetpassword', data)
}
export function user (state) {
  return api.get('/auth/user').then((response) => {
    state.commit('setUser', response.data.user)
  })
}
export function roleuser (state) {
  return api.get('/auth/roleuser').then((response) => {
    state.commit('setRoleUser', response.data)
  })
}
export function changepassword (state, data) {
  return api.post('/auth/changepassword', data)
}
export function fetch (state) {
  let token
  if (LocalStorage.has('token')) {
    token = LocalStorage.getItem('token')
  }
  if (token) {
    api.defaults.headers.common.Authorization = 'Bearer ' + token
    return api.get('auth/user').then((response) => {
      state.commit('setUser', response.data)
    })
  }
}
export function logout (state) {
  return api.get('/auth/logout')
    .then(() => {
      delete api.defaults.headers.common.Authorization
      if (LocalStorage.has('token')) {
        LocalStorage.remove('token')
      }
      state.commit('setUser', null)
    })
}
export function cleartoken (state) {
  if (LocalStorage.has('token')) {
    LocalStorage.remove('token')
  }
  state.commit('setUser', null)
  delete api.defaults.headers.common.Authorization
}
export function login (state, data) {
  return api.post('/auth/loginadmin', data).then((response) => {
    const token = response.data.data.token
    state.commit('setUser', response.data.data.user)
    api.defaults.headers.common.Authorization = 'Bearer ' + token
    LocalStorage.set('token', token)
  })
}
