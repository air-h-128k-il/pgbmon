import Vuex from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
import { mount, createLocalVue } from '@vue/test-utils'
import * as api from '~/store/api'
import * as statistics from '~/store/statistics'

const localVue = createLocalVue()
localVue.use(Vuex)

var action
var store = new Vuex.Store({
  state: () => ({}),
  actions: {},
  // store使用モジュールの宣言
  modules: {
    statistics: { 
      namespaced: true,
      state: cloneDeep(statistics.state),
      getters: cloneDeep(statistics.getters),
      actions: cloneDeep(statistics.actions),
      mutations: cloneDeep(statistics.mutations)
    }
  }
})

jest.mock('~/store/api', () => ({
  getApi: jest.fn(),
  postApi: jest.fn()
}))

describe('store/statistics.js', () => {
  beforeEach(() => {
  })

  /*
   * actionのテスト
   */
  describe('actions', () => {
    var params
    var testAction
    beforeEach(() => {
      params = {callback: null}
      testAction = (params = {}, data = {}) => {
        return store.dispatch.bind({api: api, process: process} )(action, data)
      }
    })

    // doGetCacheHitDb Test
    describe('doGetCacheHitDb', () => {
      // 正常系応答
      const okResult = {
        status: 200,
        data: {
          value: [
            {'host': 'localhost', 'db': 'db1', 'result': [
              { datname: 'db1', cache_hit_ratio: '50.00' }
            ]},
            {'host': 'localhost', 'db': 'db2', 'result': [
              { datname: 'db2', cache_hit_ratio: '55.00' }
            ]},
            {'host': 'localhost', 'db': 'db', 'result': [
              { datname: 'db3', cache_hit_ratio: '46.00' }
            ]},
          ]
        } 
      }
      const ngResult = {
        status: 400,
        data: {message: 'bad request'}
      }

      test('test doGetCacheHitDb ok', async ()=> {
        // 正常系テスト
        api.getApi.mockImplementationOnce( () => okResult)
        action = 'statistics/doGetCacheHitDb'
        await testAction(params, {scale: 2})
        store.hotUpdate(store.state)

        const cacheHiDb = store.getters['statistics/getCacheHitDb']
        expect(cacheHiDb).toEqual(okResult.data.value)
      })

      test('test doGetCacheHitDb ok (no param)', async ()=> {
        // 正常系テスト
        api.getApi.mockImplementationOnce( () => okResult)
        action = 'statistics/doGetCacheHitDb'
        await testAction(params, {})
        store.hotUpdate(store.state)

        const cacheHiDb = store.getters['statistics/getCacheHitDb']
        expect(cacheHiDb).toEqual(okResult.data.value)
      })

      test('test doGetCacheHitDb NG', async ()=> {
        // 異常系テスト
        api.getApi.mockImplementationOnce( () => ngResult)
        action = 'statistics/doGetCacheHitDb'
        await testAction(params, {scale: 'abc'})
        store.hotUpdate(store.state)

        const cacheHiDb = store.getters['statistics/getCacheHitDb']
        expect(cacheHiDb).toEqual([])
      })

    })

    // doGetCacheHitTable Test
    describe('doGetCacheHitTable', () => {
      // 正常系応答
      const okResult = {
        status: 200,
        data: {
          value: [
            {'host': 'localhost', 'db': 'db1', 'result': [
                { relname: 'pgbench_accounts', cache_hit_ratio: '24.00' },
                { relname: 'pgbench_branches', cache_hit_ratio: '99.00' }
            ]},
            {'host': 'localhost', 'db': 'db2', 'result': [
                { relname: 'pgbench_accounts', cache_hit_ratio: '24.00' },
                { relname: 'pgbench_branches', cache_hit_ratio: '99.00' }
            ]},
            {'host': 'localhost', 'db': 'db3', 'result': [
                { relname: 'pgbench_accounts', cache_hit_ratio: '24.00' },
                { relname: 'pgbench_branches', cache_hit_ratio: '99.00' }
            ]}
          ]
        }
      }
      const ngResult = {
        status: 400,
        data: {message: 'bad request'}
      }

      test('test doGetCacheHitTable ok', async ()=> {
        // 正常系テスト
        api.getApi.mockImplementationOnce( () => okResult)
        action = 'statistics/doGetCacheHitTable'
        await testAction(params, {scale: 2})
        store.hotUpdate(store.state)

        const cacheHitTable = store.getters['statistics/getCacheHitTable']
        expect(cacheHitTable).toEqual(okResult.data.value)
      })

      test('test doGetCacheHitTable ok (no param)', async ()=> {
        // 正常系テスト
        api.getApi.mockImplementationOnce( () => okResult)
        action = 'statistics/doGetCacheHitTable'
        await testAction(params, {})
        store.hotUpdate(store.state)

        const cacheHitTable = store.getters['statistics/getCacheHitTable']
        expect(cacheHitTable).toEqual(okResult.data.value)
      })

      test('test doGetCacheHitTable NG', async ()=> {
        // 異常系テスト
        api.getApi.mockImplementationOnce( () => ngResult)
        action = 'statistics/doGetCacheHitTable'
        await testAction(params, {})
        store.hotUpdate(store.state)

        const cacheHitTable = store.getters['statistics/getCacheHitTable']
        expect(cacheHitTable).toEqual([])
      })

    })

    // doGetCacheHitIndex Test
    describe('doGetCacheHitIndex', () => {
      // 正常系応答
      const okResult = {
        status: 200,
        data: {
          value: [
            {'host': 'localhost', 'db': 'db1', 'result': [
              {
                relname: 'pgbench_accounts',
                indexrelname: 'pgbench_accounts_pkey',
                cache_hit_ratio: '86.00'
              },
              {
                relname: 'pgbench_branches',
                indexrelname: 'pgbench_branches_pkey',
                cache_hit_ratio: '96.00'
              }
            ]},
            {'host': 'localhost', 'db': 'db2', 'result': [
              {
                relname: 'pgbench_accounts',
                indexrelname: 'pgbench_accounts_pkey',
                cache_hit_ratio: '76.00'
              },
              {
                relname: 'pgbench_branches',
                indexrelname: 'pgbench_branches_pkey',
                cache_hit_ratio: '86.00'
              }
            ]},
            {'host': 'localhost', 'db': 'db3', 'result': [
              {
                relname: 'pgbench_accounts',
                indexrelname: 'pgbench_accounts_pkey',
                cache_hit_ratio: '56.00'
              },
              {
                relname: 'pgbench_branches',
                indexrelname: 'pgbench_branches_pkey',
                cache_hit_ratio: '66.00'
              }
            ]}
          ]
        }
      }
      const ngResult = {
        status: 400,
        data: {message: 'bad request'}
      }

      test('test doGetCacheHitIndex ok', async ()=> {
        // 正常系テスト
        api.getApi.mockImplementationOnce( () => okResult)
        action = 'statistics/doGetCacheHitIndex'
        await testAction(params, {scale: 2})
        store.hotUpdate(store.state)

        const cacheHitIndex = store.getters['statistics/getCacheHitIndex']
        expect(cacheHitIndex).toEqual(okResult.data.value)
      })

      test('test doGetCacheHitIndex ok (no param)', async ()=> {
        // 正常系テスト
        api.getApi.mockImplementationOnce( () => okResult)
        action = 'statistics/doGetCacheHitIndex'
        await testAction(params, {})
        store.hotUpdate(store.state)

        const cacheHitIndex = store.getters['statistics/getCacheHitIndex']
        expect(cacheHitIndex).toEqual(okResult.data.value)
      })

      test('test doGetCacheHitIndex NG', async ()=> {
        // 異常系テスト
        api.getApi.mockImplementationOnce( () => ngResult)
        action = 'statistics/doGetCacheHitIndex'
        await testAction(params, {})
        store.hotUpdate(store.state)

        const cacheHitIndex = store.getters['statistics/getCacheHitIndex']
        expect(cacheHitIndex).toEqual([])
      })

    })

    // doGetGarbage Test
    describe('doGetGarbage', () => {
      // 正常系応答
      const okResult = {
        status: 200,
        data: {
          value: [
            {'host': 'localhost', 'db': 'db1', 'result': [
              {
                relname: 'pgbench_history',
                n_live_tup: '100',
                n_dead_tup: '0',
                dead_ratio: '0.00',
                pg_relation_size: '8192'
              },
              {
                relname: 'pgbench_accounts',
                n_live_tup: '10000035',
                n_dead_tup: '400',
                dead_ratio: '0.00',
                pg_relation_size: '1343283200'
              }       
            ]},
            {'host': 'localhost', 'db': 'db2', 'result': [
              {
                relname: 'pgbench_history',
                n_live_tup: '100',
                n_dead_tup: '0',
                dead_ratio: '0.00',
                pg_relation_size: '8192'
              },
              {
                relname: 'pgbench_accounts',
                n_live_tup: '10000035',
                n_dead_tup: '400',
                dead_ratio: '0.00',
                pg_relation_size: '1343283200'
              }       
            ]},
            {'host': 'localhost', 'db': 'db3', 'result': [
              {
                relname: 'pgbench_history',
                n_live_tup: '100',
                n_dead_tup: '0',
                dead_ratio: '0.00',
                pg_relation_size: '8192'
              },
              {
                relname: 'pgbench_accounts',
                n_live_tup: '10000035',
                n_dead_tup: '400',
                dead_ratio: '0.00',
                pg_relation_size: '1343283200'
              }       
            ]}
          ]
        }
      }
      const ngResult = {
        status: 400,
        data: {message: 'bad request'}
      }

      test('test doGetGarbage ok', async ()=> {
        // 正常系テスト
        api.getApi.mockImplementationOnce( () => okResult)
        action = 'statistics/doGetGarbage'
        await testAction(params, {scale: 2})
        store.hotUpdate(store.state)

        const garbage = store.getters['statistics/getGarbage']
        expect(garbage).toEqual(okResult.data.value)
      })

      test('test doGetGarbage ok (no param)', async ()=> {
        // 正常系テスト
        api.getApi.mockImplementationOnce( () => okResult)
        action = 'statistics/doGetGarbage'
        await testAction(params)
        store.hotUpdate(store.state)

        const garbage = store.getters['statistics/getGarbage']
        expect(garbage).toEqual(okResult.data.value)
      })

      test('test doGetGarbage NG', async ()=> {
        // 異常系テスト
        api.getApi.mockImplementationOnce( () => ngResult)
        action = 'statistics/doGetGarbage'
        await testAction(params, {})
        store.hotUpdate(store.state)

        const garbage = store.getters['statistics/getGarbage']
        expect(garbage).toEqual([])
      })

    })

    // doGetDbSize Test
    describe('doGetDbSize', () => {
      // 正常系応答
      const okResult = {
        status: 200,
        data: {
          value: [
            {'host': 'localhost', 'db': 'db1', 'result': [
              { pg_database_size: '1576649583' }
            ]},
            {'host': 'localhost', 'db': 'db2', 'result': [
              { pg_database_size: '1106649967' }
            ]},
            {'host': 'localhost', 'db': 'db', 'result': [
              { pg_database_size: '1889903471' }
            ]},
          ]
        } 
      }
      const ngResult = {
        status: 400,
        data: {message: 'bad request'}
      }

      test('test doGetDbSize ok', async ()=> {
        // 正常系テスト
        api.getApi.mockImplementationOnce( () => okResult)
        action = 'statistics/doGetDbSize'
        await testAction(params, {})
        store.hotUpdate(store.state)

        const dbSize = store.getters['statistics/getDbSize']
        expect(dbSize).toEqual(okResult.data.value)
      })

      test('test doGetDbSize NG', async ()=> {
        // 異常系テスト
        api.getApi.mockImplementationOnce( () => ngResult)
        action = 'statistics/doGetDbSize'
        await testAction(params, {})
        store.hotUpdate(store.state)

        const dbSize = store.getters['statistics/getDbSize']
        expect(dbSize).toEqual([])
      })

    })

    // doGetSqlCall Test
    describe('doGetSqlCall', () => {
      // 正常系応答
      const okResult = {
        status: 200,
        data: {
          date: '1575870652420',
          value: [
            {'host': 'localhost', 'db': 'db1', 'result': [
              {'sql': 'select', 'call': 100},
              {'sql': 'insert', 'call': 90},
              {'sql': 'update', 'call': 80},
              {'sql': 'delete', 'call': 70}
            ]},
            {'host': 'localhost', 'db': 'db2', 'result': [
              {'sql': 'select', 'call': 120},
              {'sql': 'insert', 'call': 110},
              {'sql': 'update', 'call': 100},
              {'sql': 'delete', 'call': 90}
            ]},
            {'host': 'localhost', 'db': 'db3', 'result': [
              {'sql': 'select', 'call': 50},
              {'sql': 'insert', 'call': 40},
              {'sql': 'update', 'call': 30},
              {'sql': 'delete', 'call': 20}
            ]}
          ]
        }
      }
      const ngResult = {
        status: 400,
        data: {message: 'bad request'}
      }

      test('test doGetSqlCall ok', async ()=> {
        // 正常系テスト
        api.getApi.mockImplementationOnce( () => okResult)
        action = 'statistics/doGetSqlCall'
        await testAction(params, {})
        store.hotUpdate(store.state)

        const sqlCall = store.getters['statistics/getSqlCall']
        expect(sqlCall).toEqual(okResult.data)
      })

      test('test doGetSlowQuery NG', async ()=> {
        // 異常系テスト
        api.getApi.mockImplementationOnce( () => ngResult)
        action = 'statistics/doGetSqlCall'
        await testAction(params, {})
        store.hotUpdate(store.state)

        const sqlCall = store.getters['statistics/getSqlCall']
        expect(sqlCall).toBeNull()
      })

    })


    // doGetSlowQuery Test
    describe('doGetSlowQuery', () => {
      // 正常系応答
      const okResult = {
        status: 200,
        data: {
          value: [
            {'host': 'localhost', 'db': 'db1', 'result': [
              {
                query: 'copy pgbench_accounts from stdin',
                calls: '1',
                mean_time: 56801.7614,
                min_time: 56801.7614,
                max_time: 56801.7614
              },
              {
                query: 'copy pgbench_accounts from stdin',
                calls: '1',
                mean_time: 49246.7166,
                min_time: 49246.7166,
                max_time: 49246.7166
              }
            ]},
            {'host': 'localhost', 'db': 'db2', 'result': [
              {
                query: 'copy pgbench_accounts from stdin',
                calls: '1',
                mean_time: 56801.7614,
                min_time: 56801.7614,
                max_time: 56801.7614
              },
              {
                query: 'copy pgbench_accounts from stdin',
                calls: '1',
                mean_time: 49246.7166,
                min_time: 49246.7166,
                max_time: 49246.7166
              }
            ]},
            {'host': 'localhost', 'db': 'db3', 'result': [
              {
                query: 'copy pgbench_accounts from stdin',
                calls: '1',
                mean_time: 56801.7614,
                min_time: 56801.7614,
                max_time: 56801.7614
              },
              {
                query: 'copy pgbench_accounts from stdin',
                calls: '1',
                mean_time: 49246.7166,
                min_time: 49246.7166,
                max_time: 49246.7166
              }
            ]}
          ]
        }
      }
      const ngResult = {
        status: 400,
        data: {message: 'bad request'}
      }

      test('test doGetSlowQuery ok', async ()=> {
        // 正常系テスト
        api.getApi.mockImplementationOnce( () => okResult)
        action = 'statistics/doGetSlowQuery'
        await testAction(params, {threshold: 100, limit: 20})
        store.hotUpdate(store.state)

        const slowQuery = store.getters['statistics/getSlowQuery']
        expect(slowQuery).toEqual(okResult.data.value)
      })

      test('test doGetSlowQuery ok (no param)', async ()=> {
        // 正常系テスト
        api.getApi.mockImplementationOnce( () => okResult)
        action = 'statistics/doGetSlowQuery'
        await testAction(params, {})
        store.hotUpdate(store.state)

        const slowQuery = store.getters['statistics/getSlowQuery']
        expect(slowQuery).toEqual(okResult.data.value)
      })

      test('test doGetSlowQuery NG', async ()=> {
        // 異常系テスト
        api.getApi.mockImplementationOnce( () => ngResult)
        action = 'statistics/doGetSlowQuery'
        await testAction(params, {threshold: 100, limit: 20})
        store.hotUpdate(store.state)

        const slowQuery = store.getters['statistics/getSlowQuery']
        expect(slowQuery).toEqual([])
      })

    })

  })
})