const { application } = require("express")
const express = require("express")
const fs = require('fs')

const app = express()

/**
 * @param {string} currency
 * @returns {string}
 */
async function getCurrencyRate(currency) {
    let value
    try {
        var files = fs.readdirSync(`${__dirname}/trustsets/XRP_${currency}`)
        var lastFile = files[files.length - 1]
        value = fs.readFileSync(`${__dirname}/trustsets/XRP_${currency}/${lastFile}`).toString()
    } catch(err) {
        throw err
    }
    return value
}

/**
 * 
 * @param {string} from 
 * @param {string} to 
 */
async function getExchangeRate(from, to) {
    return {
        fromValue: parseFloat(await getCurrencyRate(from)),
        toValue: parseFloat(await getCurrencyRate(to))
    }
}

app.get("/rate/:from/:to", async (req, res) => {
    const {from, to} = req.params
    const {fromValue, toValue} = await getExchangeRate(from, to)
    res.json({value: toValue/fromValue})
})

app.get("/exchange/:from/:to/:amount", async (req, res) => {
    const {from, to, amount} = req.params
    const {fromValue, toValue} = await getExchangeRate(from, to)
    res.json({value: (toValue/fromValue)*amount})
})

app.listen(3000)