import './assets/main.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

import { initializeApp } from "firebase/app";
import {createApp} from 'vue'
import {createPinia} from 'pinia'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import Menubar from 'primevue/menubar';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Toast from 'primevue/toast'
import ProgressSpinner from 'primevue/progressspinner'
import AppCard from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ConfirmDialog from 'primevue/confirmdialog'
import InlineMessage from 'primevue/inlinemessage'
import InputNumber from "primevue/inputnumber";
import Textarea from "primevue/textarea";
import Calendar from "primevue/calendar";
import RadioButton from "primevue/radiobutton";

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
app.use(ConfirmationService)
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
app.component('app-card', AppCard)
app.component('app-datatable', DataTable)
app.component('app-column', Column)
app.component('app-dialog', ConfirmDialog)
app.component('app-message', InlineMessage)
app.component('app-input-number', InputNumber)
app.component('app-textarea', Textarea)
app.component('app-calendar', Calendar)
app.component('app-radio', RadioButton)

app.mount('#app');


