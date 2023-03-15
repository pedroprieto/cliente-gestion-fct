<template>
  <article class="message" :class="{'is-danger': FCT.error, 'is-info': !FCT.error}">
  <div class="message-header">
    <p>Error</p>
    <button @click="cerrarMensaje()"  type="button" class="delete" aria-label="delete"></button>
  </div>
  <div class="message-body">
    {{ FCT.mensaje }}
  </div>
</article>
</template>

<script>
import { gestionFCTStore } from '@/stores/gestionfct'

export default {
    created() {
        setTimeout(() => {
            this.FCT.resetMensaje();
            }, this.tiempo_cierre);
    },
    data() {
        return {
            tiempo_cierre: 3000,
            FCT: gestionFCTStore(), 
        }
    },
    methods: {
        cerrarMensaje() {
            this.FCT.resetMensaje();
        }
    }
}
</script>

<style scoped>
.message {
position: fixed;
bottom: 1em;
}
</style>
