<template>
    <article id="mensaje" class="notification" :class="{'is-danger': FCT.error, 'is-info': !FCT.error}">
      <button @click="cerrarMensaje()"  type="button" class="delete" aria-label="delete"></button>
      {{ FCT.mensaje }}
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
#mensaje {
    left: 10%;
    width: 80%;
    position: fixed;
    bottom: 0;
}
</style>
