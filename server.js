const express = require('express');
require('dotenv').config();
const app = express();
const bodyParser = require('body-parser');
const { authRoutes, userRoutes, configRoutes, securityRoutes, userSecurityRoutes } = require('./src/api');
const cron = require('node-cron');
const cors = require('cors');
const { default: axios } = require('axios');
const { create, deleteAllSecurity } = require('./src/api/securities/securitiesModel');

//Environment variable
const port = process.env.PORT

//parser
app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: false }))



//CORS
app.use(cors())

//defualt url callback
app.get("/", (req, res) => {
    res.status(200).send({
        message: "Node.js application server"
    })
})

//middleware
app.use('/api',
    userRoutes /* User Routes */,
    authRoutes /* Authentication Routes */,
    configRoutes /* User Configuration Routes */,
    securityRoutes /* Secuirty Companies route */,
    userSecurityRoutes
)

app.use('/uploads', express.static('uploads'))

/**
 * This Cron Fetches the data from api everyday @ 3PM from Sun to Fri.
 */


cron.schedule('0 15 * * 0-5', async () => {
    var response = await axios.get('https://bishaludas.github.io/NEPSE-Api/api/todayshare.json');
    const body = response.data;
    deleteAllSecurity((err) => {
        if (err) console.log('err deleteing', err);
    });
    if (Array.isArray(body)) {
        for (var i = 0; i < body.length; i++) {
            let item = body[i]
            if (i === (body.length - 1)) {
                console.log("fetched successfully");
            }
            else create(item, (err, result) => {
                if (err) {
                    console.log("err", err);
                }
            })
        }
    } else {
        console.log("ffetching error");
    }
}, { timezone: 'Asia/Kathmandu' });


app.listen(port || 3000, () => {
    console.log(`Server is running on port ${port}`);
})