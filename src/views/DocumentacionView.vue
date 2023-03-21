<template>
  <div>
  <NavBar/>
<div class="container">
  <TituloPagina titulo="Documentación"/>
  
  <DocumentacionList />
</div>
</div>
</template>

<script setup>
import DocumentacionList from '../components/DocumentacionList.vue'
import TituloPagina from '../components/TituloPagina.vue'
import NavBar from '../components/NavBar.vue'
</script>
<style></style>
