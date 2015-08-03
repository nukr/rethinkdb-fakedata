import rethinkdbdash from 'rethinkdbdash'
import faker from 'faker'
import _ from 'lodash'
import elasticsearch from 'elasticsearch'

let client = new elasticsearch.Client({
  host: '192.168.184.5:9200',
  log: 'trace'
})

let r = rethinkdbdash({
  host: '192.168.184.5'
})

const DB_NAME = 'fakedata'
const TABLE_NAME = 'cards'

let ensureNewDb = (dbName) => {
  return r.branch(
    r.dbList().contains(dbName),
    r.branch(
      r.dbDrop(dbName),
      r.dbCreate(dbName),
      r.dbList()
    ),
    r.dbCreate(dbName)
  )
}

async () => {
  await ensureNewDb(DB_NAME)
  await r.db(DB_NAME).tableCreate(TABLE_NAME)
  await Promise.all(
    _.range(1000).map(() => {
      return r.db(DB_NAME).table(TABLE_NAME).insert(faker.helpers.createCard())
    })
  )

  client.ping({
    requestTimeout: Infinity,
    hello: 'elasticsearch'
  }, (error) => {
    if (error) {
      console.trace('elasticsearch cluster is down!!')
    } else {
      console.log('all is well')
    }
  })

  let rethinkdbResult = await r.db(DB_NAME).table(TABLE_NAME)
  console.log(rethinkdbResult.length)

  let search = await client.search({ q: 'Wei' })
  console.dir(search.hits.hits)
  r.getPoolMaster().drain()
}().catch(console.log)
