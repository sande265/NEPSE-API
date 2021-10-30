const pool = require("../../database/database")

module.exports = {
    create: (data, callback) => {
        pool.query(
            `INSERT into securities (amount, diff, max_price, min_price, no_of_trans, prev_closing, name, traded_qty, closing_price)
                    values(?,?,?,?,?,?,?,?,?)`,
            [
                data['Amount'],
                data['Difference Rs.'],
                data['Max Price'],
                data['Min Price'],
                data['No. Of Transactions'],
                data['Previous Closing'],
                data['Traded Companies'],
                data['Traded Shares'],
                data['Closing Price'],
            ],
            (error, result) => {
                if (error) return callback(error)
                return (callback(null, result))
            }
        )
    },
    createCompanies: (data, callback) => {
        pool.query(
            `INSERT into companies (id, sector, name, symbol)
                    values(?,?,?,?)`,
            [
                data['S.N.'],
                data['Sector'],
                data['Stock Name'],
                data['Stock Symbol'],
            ],
            (error, result) => {
                if (error) return callback(error)
                return (callback(null, result))
            }
        )
    },
    getAll: callback => {
        pool.query(
            `SELECT * FROM securities JOIN companies ON securities.name = companies.name`,
            [],
            (error, result) => {
                if (error) return callback(error)
                return callback(null, result)
            }
        )
    },
    getSecurity: (id, callback) => {
        pool.query(
            `SELECT * FROM securities JOIN companies ON securities.name = companies.name where id = ?`,
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
            `UPDATE securities set name=?, securityName=?, symbol=?, activeStatus=? where id = ?`,
            [
                data.name,
                data.securityName,
                data.symbol,
                data.activeStatus,
                id
            ],
            (error, result) => {
                if (error) return callback(error)
                return callback(null, result)
            }
        )
    },
    deleteSecurity: (id, callback) => {
        pool.query(
            `DELETE from securities where id = ?`,
            [id],
            (error, result) => {
                if (error) return callback(error)
                return callback(null, result)
            }
        )
    },
    deleteAllSecurity: (callback) => {
        pool.query(
            `DELETE from securities`,
            [],
            (error, result) => {
                if (error) return callback(error)
                return callback(null, result)
            }
        )
    },
    searchScrip: (query, callback) => {
        pool.query(
            `SELECT * FROM securities INNER JOIN companies ON securities.name = companies.name WHERE CONCAT(securities.name,companies.symbol) LIKE (?)`,
            [`%${query}%`],
            (error, result) => {
                if (error) return callback(error)
                return callback(null, result)
            }
        )
    }
}