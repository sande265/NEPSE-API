const pool = require("../../database/database")

module.exports = {
    getSecurities: (user_id, callback) => {
        pool.query(
            `SELECT * FROM user_securities JOIN securities ON user_securities.name = securities.name JOIN companies ON user_securities.name = companies.name where user_id = ?`,
            [user_id],
            (error, result) => {
                if (error) callback(error)
                else callback(null, result)
            }
        )
    },
    searchScrip: (query, callback) => {
        pool.query(
            `SELECT * FROM user_securities INNER JOIN securities ON user_securities.name = securities.name INNER JOIN companies on user_securities.name = companies.name WHERE CONCAT(user_securities.name,companies.symbol) LIKE (?)`,
            [`%${query}%`],
            (error, result) => {
                if (error) return callback(error)
                return callback(null, result)
            }
        )
    }
}