import { createRouter, createWebHistory } from 'vue-router'
import ListFCTView from '../views/ListFCTView.vue'
import ListVisitView from '../views/ListVisitView.vue'
import FM34View from '../views/FM34View.vue'
import LoginView from '../views/LoginView.vue'
import EtiquetasView from '../views/EtiquetasView.vue'
import FormularioVisita from '../views/FormularioVisita.vue'
import FormularioComprobante from '../views/FormularioComprobante.vue'
import { CP } from '../aux/cursoperiodo'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: {
        name: 'fcts',
        params: { curso: CP.getCursoActual(), periodo: CP.getPeriodoActual().value }
      }
    },
    {
      path: '/api/users/fcts/items/:curso/:periodo/fcts',
      name: 'fcts',
      meta: {
        prompt: 'Lista de FCTs'
      },
      component: ListFCTView,
      props: true
    },
    {
      path: '/api/users/fcts/items/:curso/:periodo/fcts/:fctId',
      name: 'visitas',
      meta: {
        prompt: 'Lista de Visitas'
      },
      component: ListVisitView,
      props: true
    },
    {
      name: 'anyadirVisita',
      path: '/api/users/fcts/items/:curso/:periodo/fcts/:fctId/addVisita',
      component: FormularioVisita,
      props: true
    },
    {
      name: 'editarVisita',
      path: '/api/users/fcts/items/:curso/:periodo/fcts/:fctId/editarVisita/:visitaId',
      component: FormularioVisita,
      props: true
    },
    {
      name: 'subirComprobante',
      path: '/api/users/fcts/items/:curso/:periodo/fcts/:fctId/subirComprobante/:visitaId',
      component: FormularioComprobante,
      props: true
    },
    {
      path: '/api/users/fcts/items/:curso/:periodo/fm34s',
      name: 'fm34s',
      meta: {
        prompt: 'FM34'
      },
      component: FM34View,
      props: true
    },
    {
      path: '/api/users/fcts/items/:curso/:periodo/etiquetas',
      name: 'etiquetas',
      meta: {
        prompt: 'Etiquetas'
      },
      component: EtiquetasView,
      props: true
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        prompt: 'Login'
      },
      component: LoginView,
      props: (route) => ({})
    }
  ]
})

export default router
