const expect = require('expect')
const express = require('express')
const app = require('../index.js')
var req = require('supertest').agent(app)

describe('getCacheHitDb', () => {
  it('GET getCacheHitDb', (done) => {
    req.get('/statistics/getCacheHitDb')
      .query({'scale': 2})
      .expect(200, function(err, res) {
        expect(res.body.value.length).toBeGreaterThan(0)
        // console.log(res.body)
        // console.log(res.body.value[0].result)
        done()
      })
  })
  it('GET getCacheHitDb no param', (done) => {
    req.get('/statistics/getCacheHitDb')
      .query({})
      .expect(400, function(err, res) {
        expect(res.body.message).toBe('bad request')
        done()
      })
  })
  it('GET getCacheHitDb bad param', (done) => {
    req.get('/statistics/getCacheHitDb')
      .query({'scale': 'abc'})
      .expect(400, function(err, res) {
        expect(res.body.message).toBe('bad request')
        done()
      })
  })
})

describe('getCacheHitTable', () => {
  it('GET getCacheHitTable ok', (done) => {
    req.get('/statistics/getCacheHitTable')
      .query({'scale': 2})
      .expect(200, function(err, res) {
        expect(res.body.value.length).toBeGreaterThan(0)
        // console.log(res.body)
        // console.log(res.body.value[0].result)
        done()
      })
  })
  it('GET getCacheHitTable no param', (done) => {
    req.get('/statistics/getCacheHitTable')
      .query({})
      .expect(400, function(err, res) {
        expect(res.body.message).toBe('bad request')
        done()
      })
  })
  it('GET getCacheHitTable bad param', (done) => {
    req.get('/statistics/getCacheHitTable')
      .query({'scale': 'abc'})
      .expect(400, function(err, res) {
        expect(res.body.message).toBe('bad request')
        done()
      })
  })
})

describe('getCacheHitIndex', () => {
  it('GET getCacheHitIndex ok', (done) => {
    req.get('/statistics/getCacheHitIndex')
      .query({'scale': 2})
      .expect(200, function(err, res) {
        expect(res.body.value.length).toBeGreaterThan(0)
        // console.log(res.body)
        // console.log(res.body.value[0].result)
        done()
      })
  })
  it('GET getCacheHitIndex no param', (done) => {
    req.get('/statistics/getCacheHitIndex')
      .query({})
      .expect(400, function(err, res) {
        expect(res.body.message).toBe('bad request')
        done()
      })
  })
  it('GET getCacheHitIndex bad param', (done) => {
    req.get('/statistics/getCacheHitIndex')
      .query({'scale': 'abc'})
      .expect(400, function(err, res) {
        expect(res.body.message).toBe('bad request')
        done()
      })
  })
})

describe('getGarbage', () => {
  it('GET getGarbage ok', (done) => {
    req.get('/statistics/getGarbage')
      .query({'scale': 2})
      .expect(200, function(err, res) {
        expect(res.body.value.length).toBeGreaterThan(0)
        // console.log(res.body)
        // console.log(res.body.value[0].result)
        done()
      })
  })
  it('GET getGarbage no param', (done) => {
    req.get('/statistics/getGarbage')
      .query({})
      .expect(400, function(err, res) {
        expect(res.body.message).toBe('bad request')
        done()
      })
  })
  it('GET getGarbage bad param', (done) => {
    req.get('/statistics/getGarbage')
      .query({'scale': 'abc'})
      .expect(400, function(err, res) {
        expect(res.body.message).toBe('bad request')
        done()
      })
  })
})

describe('getDbSize', () => {
  it('GET getDbSize', (done) => {
    req.get('/statistics/getDbSize')
      .query({})
      .expect(200, function(err, res) {
        expect(res.body.value.length).toBeGreaterThan(0)
        // console.log(res.body)
        // console.log(res.body.value[0].result)
        done()
      })
  })
})

describe('getSqlCalls', () => {
  it('GET getSqlCalls ok', (done) => {
    req.get('/statistics/getSqlCalls')
      .expect(200, function(err, res) {
        // console.log(res.body)
        // console.log(res.body.value[0].result)
        expect(res.body.value.length).toBeGreaterThan(0)
        done()
      })
  })
})

describe('getSlowQuery', () => {
  it('GET getSlowQuery ok', (done) => {
    req.get('/statistics/getSlowQuery')
      .query({'threshold': 1000, 'limit': 2})
      .expect(200, function(err, res) {
        expect(res.body.value.length).toBeGreaterThan(0)
        // console.log(res.body)
        // console.log(res.body.value[0].result)
        done()
      })
  })
  it('GET getSlowQuery no param', (done) => {
    req.get('/statistics/getSlowQuery')
      .query({})
      .expect(400, function(err, res) {
        expect(res.body.message).toBe('bad request')
        done()
      })
  })
  it('GET getSlowQuery bad param', (done) => {
    req.get('/statistics/getSlowQuery')
      .query({'threshold': 'abc', 'limit': 20})
      .expect(400, function(err, res) {
        expect(res.body.message).toBe('bad request')
        done()
      })
  })
})