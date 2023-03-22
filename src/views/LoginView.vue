<template>
<section class="hero is-primary is-fullheight">
  <div class="hero-body">
    <div class="container">
      <div class="columns is-centered">
        <p class="title">
          Gestión FCT
        </p>
      </div>
      <div class="columns is-centered">
        <div class="column is-5-tablet is-4-desktop is-3-widescreen">
          <form @submit.prevent="login()" class="box">
            <div class="field">
              <label for="usuario" class="label">Usuario</label>
              <div class="control has-icons-left">
                <input v-model="FCT.usuario" type="text" placeholder="Usuario" class="input" required id="usuario">
                <svg-icon class="icon is-small is-left" type="mdi" :path="mdiAccount"></svg-icon>
              </div>
            </div>
            <div class="field">
              <label for="pass" class="label">Contraseña</label>
              <div class="control has-icons-left">
                <input v-model="FCT.password" id="pass" type="password" placeholder="*******" class="input" required>
                <svg-icon class="icon is-small is-left" type="mdi" :path="mdiLock"></svg-icon>
              </div>
            </div>
            <div class="field">
              <button type="submit" class="button is-success is-fullwidth">
                Entrar
              </button>
            </div>
            <div v-if = "FCT.loginError" class="field">
              <article class="message is-danger">
                <div class="message-body">
                  Error en la autenticación.
                </div>
              </article>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</section>
</template>

<script setup>
  import SvgIcon from '@jamescoyle/vue-icon'
  import { mdiAccount } from '@mdi/js'
  import { mdiLock } from '@mdi/js'
  import { gestionFCTStore } from '@/stores/gestionfct'
  import { useRouter } from 'vue-router'
  
  const router = useRouter();
  const FCT = gestionFCTStore();

  function login() {
  sessionStorage.setItem("user", FCT.usuario);
  sessionStorage.setItem("password", FCT.password);
  FCT.loading = true;
  
  router.push({path: '/'})
  }
  
</script>

<style></style>
