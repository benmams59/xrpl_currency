const xrpl = require('xrpl')
const fs = require("fs")

/**
 * 
 * @param {String} currency 
 */
async function createAssets(currency) {
  await fs.mkdir(`${__dirname}/trustsets/XRP_${currency}`, {recursive : true}, (err) => {
    if(err) throw err
  })
}


/**
 * @returns {string[]}
 */
async function getAssets() {
  var assets = []
  await fs.readdir(__dirname + "/trustsets", (err, files) => {
    if (err) throw err
    files.forEach((file) => {
      assets.push(file.split("_")[1]);
    })
  })
  return assets
}

/**
 * 
 * @param {xrpl.TrustSet} trustset 
 */
async function createTrustset(trustset) {
  await fs.writeFile(
    `${__dirname}/trustsets/XRP_${trustset.LimitAmount.currency}/${Date.now()}`,
    trustset.LimitAmount.value,
    "utf-8",
    (err) => {
      console.log("trustset added")
  })
}

async function main() {
  const assets = await getAssets()
  console.log(assets)
  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")

  await client.connect()
  await client.request({
    "command": "subscribe",
    "streams": ["transactions_proposed"]
  })
  client.on("transaction", async (stream) => {
    var transaction = stream.transaction
    
    if (transaction.TransactionType == "TrustSet") {
      var currency = transaction.LimitAmount.currency;
      if (!assets.includes(currency)) { 
        await createAssets(currency)
        assets.push(currency)
      }
      await createTrustset(transaction)
      console.log(transaction)
    }
  })

  setTimeout(() => {
    client.disconnect().then(() => console.log("Connection closed"))
  } , 30000)
}

main()