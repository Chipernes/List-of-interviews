import './assets/main.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

import { initializeApp } from "firebase/app";
import {createApp} from 'vue'
import {createPinia} from 'pinia'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import Menubar from 'primevue/menubar';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import ProgressSpinner from 'primevue/progressspinner'

import App from './App.vue'
import router from './router'

const firebaseConfig = {
    apiKey: "AIzaSyD2o2_iM88HWP1eN2ZuXdSG42vGr4dYsyQ",
    authDomain: "list-of-interviews-b308e.firebaseapp.com",
    projectId: "list-of-interviews-b308e",
    storageBucket: "list-of-interviews-b308e.appspot.com",
    messagingSenderId: "403988799404",
    appId: "1:403988799404:web:5fb2c9f33b34559a4d2409"
};

initializeApp(firebaseConfig);

const app = createApp(App)

app.use(ToastService)
app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
        theme: {
            preset: Aura,
            options: {
                darkModeSelector: '',
            }
        }
    })
app.component('app-menubar', Menubar)
app.component('app-button', Button)
app.component('app-input-text', InputText)
app.component('app-toast', Toast)
app.component('app-progress', ProgressSpinner)

app.mount('#app');


