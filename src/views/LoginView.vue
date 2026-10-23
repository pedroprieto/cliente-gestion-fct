<template>
  <section class="hero is-primary is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <p class="title">Gestión FE</p>
        </div>
        <div class="columns is-centered">
          <div class="column is-5-tablet is-4-desktop is-4-widescreen">
            <div class="field">
              <button
                type="button"
                @click="FCT.redirectToCognito()"
                class="button is-link is-fullwidth is-large"
              >
                Iniciar sesión o registrarse
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { gestionFCTStore } from '@/stores/gestionfct'

const FCT = gestionFCTStore()
</script>
