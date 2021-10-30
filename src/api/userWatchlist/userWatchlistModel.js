const pool = require("../../database/database")

module.exports = {
    create: (data, callback) => {
        pool.query(
            `INSERT into user_config (user_id, scrips)
                    values(?,?)`,
            [
                data.user_id,
                JSON.stringify(data.scrips),
            ],
            (error, result) => {
                if (error) return callback(error)
                return (callback(null, result))
            }
        )
    },
    getAll: callback => {
        pool.query(
            `SELECT scrips, id, user_id from user_config`,
            [],
            (error, result) => {
                if (error) return callback(error)
                return callback(null, result)
            }
        )
    },
    getConfig: (id, callback) => {
        pool.query(
            `SELECT * from user_config where id = ?`,
            [id],
            (error, result) => {
                if (error) return callback(error)
                return callback(null, result)
            }
        )
    },
    update: (id, data, callback) => {
        const updated_at = new Date()
        updated_at.toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit' })
        pool.query(
            `UPDATE user_config set scrips=? , updated_at=? where id = ?`,
            [
                JSON.stringify(data.scrips),
                updated_at,
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
            `DELETE from user_config where id = ?`,
            [id],
            (error, result) => {
                if (error) return callback(error)
                return callback(null, result)
            }
        )
    },
}