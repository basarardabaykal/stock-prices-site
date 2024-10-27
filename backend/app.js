const express = require("express")
const cors = require("cors")
const axios = require("axios")
const puppeteer = require("puppeteer")
const app = express()

app.use(cors())
app.use(express.json())

app.get("/api/get", async (req, res) => {
  res.json(stocks)
})

app.post("/api/search", async (req, res) => {
  const stock = req.body.text

  try {
    const browser = await puppeteer.launch({
      headless: false,
    })
    const page = await browser.newPage()
    await page.goto("https://finance.yahoo.com", {
      waitUntil: "domcontentloaded",
    })

    await page.evaluate(() => {
      const link = document.querySelector("input[type = 'text']")
      if (link) {
        link.click()
      }
    })

    await page.type("input[type = 'text']", stock)
    await page.keyboard.press("Enter")

    await page.waitForSelector(".livePrice")

    const stockData = await page.evaluate(() => {
      let stockData = []
      let stocks = []
      let tempText = ""

      tempText = document
        .querySelector(".yf-xxbei9")
        .textContent.split("(")[1]
        .split(".")[0]
      let stockName = { id: "name", text: tempText }

      tempText = document.querySelector(".livePrice").textContent
      let livePrice = {
        id: "price",
        text: tempText,
      }

      tempText = document
        .querySelectorAll(".priceChange")[1]
        .textContent.slice(1, -1)
      let dailyChange = {
        id: "day",
        text: tempText,
      }

      tempText = document
        .querySelector("#tab-5d-qsp")
        .textContent.trim()
        .split(/\s+/)
        .pop()
      let weeklyChange = {
        id: "week",
        text: tempText,
      }

      tempText = document
        .querySelector("#tab-3m")
        .textContent.trim()
        .split(/\s+/)
        .pop()
      let monthlyChange = {
        id: "month",
        text: tempText,
      }

      tempText = document
        .querySelector("#tab-1y")
        .textContent.trim()
        .split(/\s+/)
        .pop()
      let yearlyChange = {
        id: "year",
        text: tempText,
      }

      stockData.push(
        stockName,
        livePrice,
        dailyChange,
        weeklyChange,
        monthlyChange,
        yearlyChange
      )
      return stockData
    })
    await browser.close()
    res.json(stockData)
  } catch (error) {
    console.log(error)
  }
})

const port = 5000
app.listen(port, () => console.log(`server started on port: ${port}`))
