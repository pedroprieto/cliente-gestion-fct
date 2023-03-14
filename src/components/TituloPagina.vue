<template>
  <div class="box">
    <h1 class="title">{{titulo}} </h1>
  </div>
</template>

<script setup>
const props = defineProps(['titulo'])
import { gestionFCTStore } from '@/stores/gestionfct'
</script>

<style></style>
