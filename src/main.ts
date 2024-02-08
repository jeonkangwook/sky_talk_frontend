import './assets/css/reset.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from './plugins/axios'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import piniaPersist from 'pinia-plugin-persistedstate';


import App from './App.vue'
import router from './router'

const pinia = createPinia();
pinia.use(piniaPersist);

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(axios as any)

app.mount('#app')

