import { createRouter, createWebHistory } from 'vue-router'
import ListFCTView from '../views/ListFCTView.vue'
import DocumentacionView from '../views/DocumentacionView.vue'
import FM34View from '../views/FM34View.vue'
import ImportarView from '../views/ImportarView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'fcts',
        meta: {
            prompt: "Lista de FCTs",
        },
      component: ListFCTView,
        props: route => ({ curso: route.query.curso, periodo: route.query.periodo })
    },
    {
      path: '/importar',
      name: 'importar',
        meta: {
            prompt: "Importar FCTs",
        },
      component: ImportarView,
        props: route => ({ curso: route.query.curso, periodo: route.query.periodo })
    },
    {
      path: '/documentacion',
      name: 'documentacion',
        meta: {
            prompt: "Documentación",
        },
      component: DocumentacionView,
        props: route => ({ curso: route.query.curso, periodo: route.query.periodo })
    },
    {
      path: '/fm34s',
      name: 'fm34s',
        meta: {
            prompt: "FM34",
        },
      component: FM34View,
        props: route => ({ curso: route.query.curso, periodo: route.query.periodo })
    },
  ]
})

export default router
