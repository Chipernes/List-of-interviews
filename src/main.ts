import './assets/main.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

import {createApp} from 'vue'
import {createPinia} from 'pinia'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import Menubar from 'primevue/menubar';

import App from './App.vue'
import router from './router'

const app = createApp(App)

app
    .use(createPinia())
    .use(router)
    .use(PrimeVue, {
        theme: {
            preset: Aura
        }
    })
    .component('app-menubar', Menubar)
    .mount('#app');


