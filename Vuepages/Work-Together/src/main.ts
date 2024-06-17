import './assets/main.css'
import { createApp } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import globalComponent from './components/register'
import router from "./router"
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
library.add(fas);
const app = createApp(App);
app.use(router);
app.use(ElementPlus)
app.component('fa', FontAwesomeIcon);
app.mount('#app');
app.use(globalComponent);