import { api } from 'boot/axios'

export function getproduct (state) {
  return api.get('/products/product').then((response) => {
    state.commit('setProduct', response.data)
  })
}
export function getimgproduct (state, id) {
  return api.get('/products/imgproduct/' + id).then((response) => {
    state.commit('setImgproduct', response.data)
  })
}
export function getimgurl (state, imgname) {
  return api.get('/products/getimage/' + imgname, { responseType: 'blob' })
}
export function insertproduct (state, data) {
  return api.post('/products/insertproduct', data).then((response) => {
    state.commit('setProduct', response.data)
  })
}
export function updateproduct (state, data) {
  return api.post('/products/updateproduct', data).then((response) => {
    state.commit('setProduct', response.data)
  })
}
export function deleteproduct (state, data) {
  return api.post('/products/deleteproduct', data).then((response) => {
    state.commit('setProduct', response.data)
  })
}
