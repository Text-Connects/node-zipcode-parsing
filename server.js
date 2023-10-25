const express = require("express")
const fetch = require("node-fetch")

const app = express()
const port = 3000

const API_URL = "http://documentation-resources.opendatasoft.com"

app.use(express.json())

app.get(`/api/explore/v2.1/:${country}/:${zipcode}`, async (req, res) => {
    try{
        const data = req.params.country + req.params.zipcode
        const apiResponse = await fetch(API_URL)
        const jsonData = await apiResponse.json()
        res.json(data, jsonData)
    } catch(error) {
        console.error(`Couldn't fetch from API: ${error}`)
        res.status(500).json({ error: `internal server error`})
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})