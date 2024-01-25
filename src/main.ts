import './assets/css/reset.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from './plugins/axios'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'


import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(axios as any)

app.mount('#app')

