import Main from 'src/layouts/Main.vue'
import Auth from 'layouts/Auth.vue'
import Login from 'pages/Login.vue'
import Authorized from 'pages/Authorized.vue'
import Bank from 'pages/Bank.vue'
import Unit from 'pages/Unit.vue'
import Courier from 'pages/Courier.vue'
import Category from 'pages/Category.vue'
import Product from 'pages/Product.vue'
import Order from 'pages/Order.vue'
import Reptransaction from 'pages/Reptransaction.vue'
import Config from 'pages/Config.vue'

const routes = [
  {
    path: '/',
    component: Main,
    children: [
      {
        path: 'product',
        name: 'product',
        component: Product,
        meta: { auth: true, authorize: ['0', '1', '2', '3', '4', '5'] }
      },
      {
        path: 'order',
        name: 'order',
        component: Order,
        meta: { auth: true, authorize: ['0', '1', '2', '3', '4', '5'] }
      },
      {
        path: 'reptransaction',
        name: 'reptransaction',
        component: Reptransaction,
        meta: { auth: true, authorize: ['0', '1', '2', '3', '4', '5'] }
      },
      {
        path: 'authorized',
        name: 'authorized',
        component: Authorized,
        meta: { auth: true, authorize: ['0', '1', '2', '3', '4', '5'] }
      },
      {
        path: 'bank',
        name: 'bank',
        component: Bank,
        meta: { auth: true, authorize: ['0', '1', '2', '3', '4', '5'] }
      },
      {
        path: 'unit',
        name: 'unit',
        component: Unit,
        meta: { auth: true, authorize: ['0', '1', '2', '3', '4', '5'] }
      },
      {
        path: 'courier',
        name: 'courier',
        component: Courier,
        meta: { auth: true, authorize: ['0', '1', '2', '3', '4', '5'] }
      },
      {
        path: 'category',
        name: 'category',
        component: Category,
        meta: { auth: true, authorize: ['0', '1', '2', '3', '4', '5'] }
      },
      {
        path: 'config',
        name: 'config',
        component: Config,
        meta: { auth: true, authorize: ['0', '1', '2', '3', '4', '5'] }
      }
    ]
  },
  {
    path: '/',
    component: Auth,
    children: [
      { path: 'login', name: 'login', component: Login, meta: { auth: false } }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
