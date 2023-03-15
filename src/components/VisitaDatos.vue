<template>
  <p>Tipo: {{ visita.tipo }}</p>
  <p>Distancia: {{ visita.distancia }}</p>
<p>Fecha: {{ new Date(visita.fecha).toLocaleDateString('es') }}</p>
  <p>Hora de salida: {{ visita.hora_salida }}</p>
  <p>Hora de llegada: {{ visita.hora_regreso }}</p>
  <p>Localidad: {{ visita.localidad }}</p>
  <p>Presencial: {{ visita.presencial ? 'Sí' : 'No' }}</p>
  <p>Impresión: {{ visita.impresion }}</p>
</template>

<script>
export default {
  props: ['visita'],
  components: {},
  data() {
    return {}
  },
  async created() {
    console.log(this.visita)
  },
  methods: {}
}
</script>

<style></style>
