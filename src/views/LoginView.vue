<template>
  <section class="hero is-fullheight">
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
                class="button is-primary is-fullwidth is-large"
              >
                Iniciar sesión o registrarse
              </button>
            </div>
          </div>
        </div>

        <article id="mensaje" class="notification is-info is-light">
          Bienvenido a la nueva versión. La <b>primera vez</b> que accedas, debes registrarte y
          <b>crear una cuenta</b>. Es muy importante que elijas como <b>nombre de usuario</b> tu
          <b>NIF</b>. De esta manera podrás consultar las FCTs/FEs realizadas en años anteriores.
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { gestionFCTStore } from '@/stores/gestionfct'

const FCT = gestionFCTStore()
</script>
