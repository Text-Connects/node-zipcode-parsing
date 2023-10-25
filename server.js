const express = require("express")
const fs = require("fs")
const path = require("path")

const app = express()
const port = 3000

const dataPath = path.join(__dirname, "data-zipcodes.json")
const zipcodeData = JSON.parse(fs.readFileSync(dataPath, "utf-8"))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get(`/api/:state/:zipcode`, (req, res) => {
    const state = req.params.state
    const zipcode = req.params.zipcode

    const matchFound = zipcodeData.find(data => data.stusps_code === state && data.zip_code === zipcode)

    if (matchFound) {
        res.json(matchFound)
    } else {
        res.status(404).json({ error: `Not found :(`})
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})


// const API_URL = "http://documentation-resources.opendatasoft.com"

// app.use(express.json())

// app.get(`/api/:${state}/:${zipcode}`, async (req, res) => {
//     try{
//         const data = req.params.state + req.params.zipcode
//         const apiResponse = await fetch(API_URL)
//         const jsonData = await apiResponse.json()
//         res.json(data, jsonData)
//     } catch(error) {
//         console.error(`Couldn't fetch from API: ${error}`)
//         res.status(500).json({ error: `internal server error`})
//     }
// })
