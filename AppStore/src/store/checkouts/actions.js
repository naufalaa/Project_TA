import { api } from 'boot/axios'

export function getcheckout (state, id) {
  return api.get('/checkouts/checkout/' + id).then((response) => {
    state.commit('setCheckout', response.data)
  })
}
