<template>
  <section class="hero is-primary is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <p class="title">Gestión FE</p>
        </div>
        <div class="columns is-centered">
          <p v-if="error" class="subtitle has-text-danger">{{ error }}</p>
          <p v-else class="subtitle">Iniciando sesión…</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { gestionFCTStore } from '@/stores/gestionfct'

const router = useRouter()
const route = useRoute()
const FCT = gestionFCTStore()
const error = ref(null)

onMounted(async () => {
  const code = route.query.code

  if (!code) {
    error.value = 'No se ha recibido el código de autorización.'
    return
  }

  try {
    await FCT.handleCallback(code)
    router.replace({ name: 'root' })
  } catch (e) {
    console.error(e)
    error.value = 'Error al iniciar sesión. Por favor, inténtalo de nuevo.'
  }
})
</script>
