<template>
<div class="columns is-centered">
  <div class="column is-5-tablet is-4-desktop is-3-widescreen">
    <button @click="importarFCTs()" :disabled="disabled" type="button" class="button is-primary is-fullwidth is-large">
      Importar FCTs
    </button>
  </div>
</div>

<article v-if="mensaje" class="message" :class="{'is-success': !error, 'is-danger': error}">
  <div class="message-header">
    <p>Información</p>
  </div>
  <div class="message-body">
    {{mensaje}}
  </div>
</article> 
</template>

<script>
import { gestionFCTStore } from '@/stores/gestionfct';

export default {
    data() {
        return {
            disabled: false,
            error: false,
            mensaje: ""
        }
    },
    methods: {
        importarFCTs: async function() {
            try {
                const FCT = gestionFCTStore();
                this.disabled = true;
                this.error = false;
                this.mensaje = "";
                let url = `http://localhost:3000/api/users/${FCT.usuario}/import_fcts`;
                let data = {
                    curso: FCT.curso,
                    periodo: FCT.periodo.value
                };
                let headers = new Headers();
                headers.set('Authorization', 'Basic ' + btoa(FCT.usuario + ":" + FCT.password));
                headers.set('Content-Type', 'application/json');
                
                let response = await fetch(url, {
                    method: 'POST',
                    mode: 'cors',
                    headers,
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    // Redirigir a listado FCT
                    this.disabled = false;
                    this.mensaje = "¡Importación realizada con éxito!";
                } else {
                    this.error = true;
                    this.disabled = false;
                    this.mensaje = "Ha ocurrido un error. Por favor, inténtelo de nuevo";
                }
            } catch(error) {
                this.error = true;
                this.disabled = false;
                this.mensaje = "Ha ocurrido un error. Por favor, inténtelo de nuevo";
                
            }
        }
    }
}
</script>

<style></style>
