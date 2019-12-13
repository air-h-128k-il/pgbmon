/**
* 統計情報取得Storeモジュール
*/
import Vue from 'vue'
import Vuex from 'vuex'
import * as api from './api'
Vue.use(Vuex)

export const state = () => ({
  cacheHitDb: [],     // DBのキャッシュヒット率
  cacheHitTable: [],  // Tableのキャッシュヒット率
  cacheHitIndex: [],  // Indexのキャッシュヒット率
  garbage: [],        // ガベージサイズ
  dbSize: [],         // DBサイズ
  slowQuery: [],      // スロークエリ
  lastSqlCall: null,  // 前回SQL実行回数
  sqlCall: null       // SQL実行回数
})

export const getters = {
  getCacheHitDb (state) {
    return state.cacheHitDb
  },
  getCacheHitTable (state) {
    return state.cacheHitTable
  },
  getCacheHitIndex (state) {
    return state.cacheHitIndex
  },
  getGarbage (state) {
    return state.garbage
  },
  getDbSize (state) {
    return state.dbSize
  },
  getSlowQuery (state) {
    return state.slowQuery
  },
  getLastSqlCall (state) {
    return state.lastSqlCall
  },
  getSqlCall (state) {
    return state.sqlCall
  }
}

export const mutations = {
  setCacheHitDb (state, cacheHitDb) {
    state.cacheHitDb = cacheHitDb
  },
  setCacheHitTable (state, cacheHitTable) {
    state.cacheHitTable = cacheHitTable
  },
  setCacheHitIndex (state, cacheHitIndex) {
    state.cacheHitIndex = cacheHitIndex
  },
  setGarbage (state, garbage) {
    state.garbage = garbage
  },
  setDbSize (state, dbSize) {
    state.dbSize = dbSize
  },
  setSlowQuery (state, slowQuery) {
    state.slowQuery = slowQuery
  },
  setLastSqlCall (state, lastSqlCall) {
    state.lastSqlCall = lastSqlCall
  },
  setSqlCall (state, sqlCall) {
    state.sqlCall = sqlCall
  }
}

export const actions = {
  // DBのキャッシュヒット率取得
  async doGetCacheHitDb (params = null) {
    const res = await api.getApi('/statistics/getCacheHitDb', 'scale=2')
    if (res.status === 200) {
      this.commit('statistics/setCacheHitDb', res.data.value)
    } else {
      this.commit('statistics/setCacheHitDb', [])
    }
  },
  // Tableのキャッシュヒット率取得
  async doGetCacheHitTable (params = null) {
    const res = await api.getApi('/statistics/getCacheHitTable', 'scale=2')
    if (res.status === 200) {
      this.commit('statistics/setCacheHitTable', res.data.value)
    } else {
      this.commit('statistics/setCacheHitTable', [])
    }
  },
  // Indexのキャッシュヒット率取得
  async doGetCacheHitIndex (params = null, data = null) {
    let scale = 2
    if (data !== null && data.scale !== undefined) {
      scale = data.scale
    }
    const res = await api.getApi('/statistics/getCacheHitIndex', 'scale=' + scale)
    if (res.status === 200) {
      await this.commit('statistics/setCacheHitIndex', res.data.value)
    } else {
      await this.commit('statistics/setCacheHitIndex', [])
    }
  },
  // ガベージサイズ取得
  async doGetGarbage (params = null, data = null) {
    let scale = 2
    if (data !== null && data.scale !== undefined) {
      scale = data.scale
    }
    const res = await api.getApi('/statistics/getGarbage', 'scale=' + scale)
    if (res.status === 200) {
      this.commit('statistics/setGarbage', res.data.value)
    } else {
      this.commit('statistics/setGarbage', [])
    }
  },
  // DBサイズ取得
  async doGetDbSize (params = null) {
    const res = await api.getApi('/statistics/getDbSize')
    if (res.status === 200) {
      this.commit('statistics/setDbSize', res.data.value)
    } else {
      this.commit('statistics/setDbSize', [])
    }
  },
  // SQL実行回数取得
  async doGetSqlCall (params = null) {
    const res = await api.getApi('/statistics/getSqlCalls')
    if (res.status === 200) {
      this.commit('statistics/setSqlCall', res.data)
    } else {
      this.commit('statistics/setSqlCall', null)
    }
  },
  // スロークエリ取得
  async doGetSlowQuery (params = null, data) {
    const threshold = data.threshold || 1000
    const limit = data.limit || 20
    const arg = 'threshold=' + threshold + '&limit=' + limit
    const res = await api.getApi('/statistics/getSlowQuery', arg)
    if (res.status === 200) {
      this.commit('statistics/setSlowQuery', res.data.value)
    } else {
      this.commit('statistics/setSlowQuery', [])
    }
  }
}
