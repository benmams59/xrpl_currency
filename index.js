const xrpl = require('xrpl')

async function main() {
  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")

  await client.connect()
  await client.request({
    "command": "subscribe",
    "streams": ["transactions_proposed"]
  })
  client.on("transaction", async (stream) => {
    var transaction = stream.transaction
    console.log(transaction)
  })
  /*client.on("ledgerClosed", async (ledger) => {
    console.log(`Ledger #${ledger.ledger_index} validated with ${ledger.txn_count} transactions!`)
  })*/
  setTimeout(() => {
    client.disconnect().then(() => console.log("Connection closed"))
  } , 30000)
}

main()