const userRoutes = require('./users/userRoute')
const authRoutes = require('./auth/authRoute')
const configRoutes = require('./userWatchlist/userWatchlistRoute')
const securityRoutes = require('./securities/securitiesRoute')
const userSecurityRoutes = require("./userSecurities/userSecuritiesRoute")

module.exports = {
    userRoutes,
    authRoutes,
    configRoutes,
    securityRoutes,
    userSecurityRoutes
}