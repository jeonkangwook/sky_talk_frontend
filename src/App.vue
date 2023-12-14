<script setup lang="ts">
import { inject, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useSessionStore } from './stores/session'
import DefaultLayout from './layouts/DefaultLayout.vue'
import NavLayout from './layouts/NavLayout.vue'
import NavBar from './components/common/NavBar.vue'


const route = useRoute()
// const $axios = inject<any>('$axios')

// TODO Get, Set session 
// const { data } = await $axios.get('/todos/1')
// console.log(data)

// const { setSession } = useSessionStore()
// setSession({
//   username: 'John',
//   usermobile: '01000000000',
//   isLoggedIn: false
// })


onMounted(async () => {
  if (window) {
    handleResize();
    window.addEventListener('resize', handleResize);
  }
})

function handleResize() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}
</script>

<template>
  <div id="app-container" :class="['app-container', route.name || '']">
    <component :is="DefaultLayout" class="view-container">
      <RouterView />
    </component>
    <NavBar />
  </div>
</template>

<style scoped>
.app-container {
  max-width: 768px;
  width: 100%;
  max-height: 1024px;
  height: calc(var(--vh) * 100);
}

.view-container {
  overflow-y: auto;
  width: 100%;
  height: calc(100% - 60px);
}

@media screen and (min-width: 769px) {
  .app-container {
    margin: 60px auto;
    border: 1px solid #f5f5f5;
  }
}
</style>
