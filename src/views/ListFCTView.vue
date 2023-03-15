<template>
  <NavBar/>
  <div class="container">
    <TituloPagina titulo="Listado de FCTs"/>

    <FCTList />
  </div>
</template>

<script setup>
import FCTList from '../components/FCTList.vue'
import TituloPagina from '../components/TituloPagina.vue'
import NavBar from '../components/NavBar.vue'
</script>

<style></style>
