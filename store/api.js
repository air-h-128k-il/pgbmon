/**
* API共通モジュール
*   POSTとGETのインターフェース共通化
*/
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)

export const postApi = async function (uri, data = null) {
  try {
    const res = await axios.post(process.env.apiUrl + uri, data)
    return res
  } catch (e) {
    return { status: 500 }
  }
}

export const getApi = async function (uri, options = null) {
  const param = (options != null) ? '?' + options : ''
  try {
    const res = await axios.get(process.env.apiUrl + uri + param)
    return res
  } catch (e) {
    return { status: 500 }
  }
}
