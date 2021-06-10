import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 移动端组件
import Vant from 'vant';
import 'vant/lib/index.css';
import moment from 'moment'
import echarts from 'echarts'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(Vant);
// PC端组件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
// 获取接口
import axios from 'axios';
Vue.prototype.$http=axios;
axios.defaults.baseURL = "https://www.liulongbin.top:8888/api/private/v1"
// 请求拦截器
axios.interceptors.request.use((config)=>{
  config.headers.Authorization=store.state.token
  return config
})
Vue.use(VueQuillEditor, /* { default global options } */)
Vue.prototype.$echarts=echarts
moment.locale('zh-cn')
Vue.prototype.$moment =moment
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
