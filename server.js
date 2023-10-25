const express = require("express")
const fs = require("fs")
const path = require("path")

const app = express()
const port = 3000

const dataPath = path.join(__dirname, "data-zipcodes.json")
const zipcodeData = JSON.parse(fs.readFileSync(dataPath, "utf-8"))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const removeLeadingZero = str => str.replace(/^0+/, "")

//Example: http://localhost:3000/api/us/10580
app.get(`/api/US/:zipcode`, (req, res) => {
    let zipcode = req.params.zipcode

    zipcode = removeLeadingZero(zipcode)

    const matchFound = zipcodeData.find(data => data.zip_code === zipcode)

    if (matchFound) {
        const filteredData = {
            city: matchFound.usps_city,
            country: "US",
            county: matchFound.primary_coty_name,
            state: matchFound.ste_name,
            state_short: matchFound.stusps_code,
            postal_code: req.params.zipcode,
            latitude: matchFound.geo_point_2d.lat,
            longitude: matchFound.geo_point_2d.lon,
            timezone: matchFound.timezone
        }
        res.json(filteredData)
    } else {
        res.status(404).json({ error: `Not found :(`})
    }
})

//Example: http://localhost:3000/api/us?city=Woodstock&state=CT
//Example: http://localhost:3000/api/us?city=Pismo%20Beach&state=CA
app.get(`/api/US`, (req, res) => {
    const city = req.query.city
    const state = req.query.state

    const cityStateData = zipcodeData
        .filter(data => data.usps_city === city && data.stusps_code === state)
        .map(data => ({
            city: data.usps_city,
            country: "US",
            county: data.primary_coty_name,
            state: data.ste_name,
            state_short: data.stusps_code,
            postal_code: data.zip_code.length < 5 ? `0${data.zip_code}` : data.zip_code,
            latitude: data.geo_point_2d.lat,
            longitude: data.geo_point_2d.lon,
            timezone: data.timezone
        }))

    if (cityStateData) {
        res.json(cityStateData)
    } else {
        res.status(404).json({ error: `Not found :(`})
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

