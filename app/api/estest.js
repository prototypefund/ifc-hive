import { Client } from '@elastic/elasticsearch'

const client = new Client({
  node: 'http://localhost:9200',
  requestTimeout: 6000,
})

async function run () {
  try {
  const response = await client.indices.create({ index: 'test-01' })
  } catch (err) {
    console.log(err)
  }
}

run()
