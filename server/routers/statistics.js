const express = require('express')
const router = express.Router()
const { pool, dbConf } = require('../models/index')

async function pgExec(sql, values, dbFlag) {
  var recs = []
  var error = null
  var query = sql
  for (let i = 0; i < pool.length; i ++) {
    const client = await pool[i].connect()
    if (dbFlag) {
      query = sql.replace('$db', dbConf[i].database)
    }
    try {
      const rec = await client.query(query, values)
      recs.push({host: dbConf[i].host, db: dbConf[i].database, result: rec.rows})
    } catch (e) {
      error = (e.messages) ? e.messages : 'internal error'
    }
    finally {
      client.release()
    }
  }
  if (! error) {
    return recs
  } else {
    return null
  }
}

function isNumeric(num) {
  return (0 === num.search(/^[0-9]+$/))
}

// DBのキャッシュヒット率
router.get('/getCacheHitDb', async function(req, res) {
  if (!('scale' in req.query)) {
    res.status(400).json({message: 'bad request'})
    return
  }
  const scale = req.query.scale
  if (! isNumeric(scale)) {
    res.status(400).json({message: 'bad request'})
    return
  }
  const sql = `SELECT datname,
   round(blks_hit*100/(blks_hit+blks_read), $1) AS cache_hit_ratio
     FROM pg_stat_database WHERE datname = '$db' AND blks_read > 0`
  const recs = await pgExec(sql, [ scale ], true)
  if (recs !== null) {
    res.send({value: recs})
  } else {
    res.status(500).json({message: 'internal error'})
  }
})

// Tableのキャッシュヒット率
router.get('/getCacheHitTable', async function(req, res) {
  if (!('scale' in req.query)) {
    res.status(400).json({message: 'bad request'})
    return
  }
  const scale = req.query.scale
  if (! isNumeric(scale)) {
    res.status(400).json({message: 'bad request'})
    return
  }
  const sql = `SELECT relname,
    round(heap_blks_hit*100/(heap_blks_hit+heap_blks_read), $1)
    AS cache_hit_ratio FROM pg_statio_user_tables
    WHERE heap_blks_read > 0 ORDER BY cache_hit_ratio`
  const recs = await pgExec(sql, [ scale ], false)
  if (recs !== null) {
    res.send({value: recs})
  } else {
    res.status(500).json({message: 'internal error'})
  }
})

// Indexのキャッシュヒット率
router.get('/getCacheHitIndex', async function(req, res) {
  if (!('scale' in req.query)) {
    res.status(400).json({message: 'bad request'})
    return
  }
  const scale = req.query.scale
  if (! isNumeric(scale)) {
    res.status(400).json({message: 'bad request'})
    return
  }
  const sql = `SELECT relname, indexrelname,
    round(idx_blks_hit*100/(idx_blks_hit+idx_blks_read), $1)
    AS cache_hit_ratio FROM pg_statio_user_indexes
    WHERE idx_blks_read > 0 ORDER BY cache_hit_ratio`
  const recs = await pgExec(sql, [ scale ], false)
  if (recs !== null) {
    res.send({value: recs})
  } else {
    res.status(500).json({message: 'internal error'})
  }
})

// ガベージサイズ
router.get('/getGarbage', async function(req, res) {
  if (!('scale' in req.query)) {
    res.status(400).json({message: 'bad request'})
    return
  }
  const scale = req.query.scale
  if (! isNumeric(scale)) {
    res.status(400).json({message: 'bad request'})
    return
  }
  const sql = `SELECT relname, n_live_tup, n_dead_tup,
    round(n_dead_tup*100/(n_dead_tup+n_live_tup), $1)  AS dead_ratio,
    pg_relation_size(relid) FROM pg_stat_user_tables
    WHERE n_live_tup > 0 ORDER BY dead_ratio DESC`
  const recs = await pgExec(sql, [ scale ], false)
  if (recs !== null) {
    res.send({value: recs})
  } else {
    res.status(500).json({message: 'internal error'})
  }
})

// DBサイズ
router.get('/getDbSize', async function(req, res) {
  const sql = `SELECT pg_database_size( '$db' )`
  const recs = await pgExec(sql, [], true)
  if (recs !== null) {
    res.send({value: recs})
  } else {
    res.status(500).json({message: 'internal error'})
  }
})

// クエリ数
router.get('/getSqlCalls', async function(req, res) {
  const sql = `SELECT substring(lower(query) from 1 for 6) as sql,
    sum(calls) as call
    FROM pg_stat_statements
    WHERE substring(lower(query) from 1 for 6) in ( 'select', 'insert', 'update', 'delete')
    GROUP BY substring(lower(query) from 1 for 6)`
  const recs = await pgExec(sql, [], false)
  if (recs !== null) {
    res.send({date: Date.now(), value: recs})
  } else {
    res.status(500).json({message: 'internal error'})
  }
})

// スロークエリ
router.get('/getSlowQuery', async function(req, res) {
  if ((!('threshold' in req.query)) || (!('limit' in req.query))) {
    res.status(400).json({message: 'bad request'})
    return
  }
  const threshold = req.query.threshold
  const limit = req.query.limit
  if ((! isNumeric(threshold)) || (! isNumeric(limit))) {
    res.status(400).json({message: 'bad request'})
    return
  }
  const sql = `SELECT query, calls, mean_time, min_time, max_time
    FROM pg_stat_statements
    WHERE max_time > $1
    ORDER BY max_time DESC
    LIMIT $2`
  const recs = await pgExec(sql, [ threshold, limit ], false)
  if (recs !== null) {
    res.send({value: recs})
  } else {
    res.status(500).json({message: 'internal error'})
  }
})

module.exports = router