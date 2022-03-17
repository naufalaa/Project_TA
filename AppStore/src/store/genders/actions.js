import { api } from 'boot/axios'

export function getgender (state) {
  return api.get('/genders/gender').then((response) => {
    state.commit('setGender', response.data)
  })
}
