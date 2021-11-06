const pool = require("../../database/database")

module.exports = {
    create: (id, data, callback) => {
        pool.query(
            `INSERT into user_securities(user_id, name, qty, buy_price, type, buy_date, sell_price, action)
                    values(?,?,?,?,?,?,?,?)`,
            [
                id,
                data.name,
                data.qty,
                data.buy_price,
                data.type,
                data.buy_date,
                data.sell_price,
                parseInt(data.action)
            ],
            (error, result) => {
                if (error) return callback(error)
                return (callback(null, result))
            }
        )
    },
    getAll: (id, callback) => {
        pool.query(
            `SELECT * from user_securities where user_id=?`,
            [id],
            (error, result) => {
                if (error) return callback(error)
                return callback(null, result)
            }
        )
    },
    getConfig: (id, callback) => {
        pool.query(
            `SELECT * from user_securities where id = ?`,
            [id],
            (error, result) => {
                if (error) return callback(error)
                return callback(null, result)
            }
        )
    },
    update: (id, data, callback) => {
        pool.query(
            `UPDATE user_securities SET name=?, qty=?, buy_price=?, type=?, buy_date=?, sell_price=?, action=? where user_id = ?`,
            [
                data.name,
                data.qty,
                data.buy_price,
                data.type,
                data_buy_date,
                data.sell_price,
                data.action,
                id
            ],
            (error, result) => {
                if (error) return callback(error)
                return callback(null, result)
            }
        )
    },
    deleteWatchlist: (id, callback) => {
        pool.query(
            `DELETE from user_securities where id = ?`,
            [id],
            (error, result) => {
                if (error) return callback(error)
                return callback(null, result)
            }
        )
    },
}