const dbConf =  require('../config.js').dbConf
const { Pool } = require('pg')
const dbNum = dbConf.length
var pool = []
for (let i = 0; i < dbNum; i ++) {
    pool[i] = new Pool(dbConf[i])
}

module.exports = { pool, dbConf }