import { api } from 'boot/axios'

export function getalltransaction (state) {
  return api.get('/transactions/alltransaction').then((response) => {
    state.commit('setAlltransaction', response.data)
  })
}
export function getnotification (state, id) {
  return api.get('/transactions/notification/' + id).then((response) => {
    state.commit('setNotification', response.data)
  })
}
export function addnotification (state, id) {
  return api.post('/transactions/addnotification/' + id).then((response) => {
    state.commit('setNotification', response.data)
  })
}
export function removenotification (state, id) {
  return api.post('/transactions/removenotification/' + id).then((response) => {
    state.commit('setNotification', response.data)
  })
}
export function getreptransaction (state) {
  return api.get('/transactions/reptransaction').then((response) => {
    state.commit('setReptransaction', response.data)
  })
}
export function updatecost (state, data) {
  return api.post('/transactions/updatecost', data).then((response) => {
    state.commit('setAlltransaction', response.data)
  })
}
export function updatereceipt (state, data) {
  return api.post('/transactions/updatereceipt', data).then((response) => {
    state.commit('setAlltransaction', response.data)
  })
}
