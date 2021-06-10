import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
//数据持久化
import persistedState from 'vuex-persistedstate'
export default new Vuex.Store({
  state: {
    user:"",
    token:'',
  },
  mutations: {
    gettoken(state,payload){
      state.token = payload
    }
  },
  actions: {

  },
  plugins: [persistedState()]
})
