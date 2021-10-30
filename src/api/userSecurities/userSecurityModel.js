const pool = require("../../database/database")

module.exports = {
    getSecurities: (user_id, callback) => {
        pool.query(
            `SELECT * FROM user_securities JOIN securities ON user_securities.name = securities.name where user_id = 1`,
            [],
            (error, result) => {
                if (error) callback(error)
                else callback(null, result)
            }
        )
    },
    searchUser: (query, callback) => {
        pool.query(
            `SELECT * FROM user WHERE CONCAT(name, username) LIKE (?)`,
            [`%${query}%`],
            (error, result) => {
                if (error) return callback(error)
                return callback(null, result)
            }
        )
    }
}