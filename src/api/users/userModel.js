const pool = require("../../database/database")


module.exports = {
    create: (data, callback) => {
        pool.query(
            `INSERT into user (name, username, password, email, role, image, status, contact)
                    values(?,?,?,?,?,?,?,?)`,
            [
                data.name,
                data.username,
                data.password,
                data.email,
                data.role ? data.role : 'user',
                data.image,
                parseInt(data.status) === 1 || data.status === true ? 1 : 0,
                data.contact,
            ], (error, result) => {
                if (error) return callback(error)
                return (callback(null, result))
            }
        )
    },
    getUsers: callback => {
        pool.query(
            `SELECT id, name, username, email, role, image, first_login, contact, created_at, updated_at, status from user`,
            [],
            (error, result) => {
                if (error) return callback(error)
                return callback(null, result)
            }
        )
    },
    getUserById: (id, callback) => {
        pool.query(
            `SELECT * from user where id = ? || username = ?`,
            [id, id],
            (error, result) => {
                delete result[0].password
                if (error) return callback(error)
                return callback(null, result)
            }
        )
    },
    updateUser: (id, data, callback) => {
        const updated_at = new Date()
        updated_at.toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit' })
        pool.query(
            `UPDATE user set name=?, username=?, email=?, role=?, image=?, updated_at = ?, status=?, contact=?, first_login=? where id = ?`,
            [
                data.name,
                data.username,
                data.email,
                data.role,
                data.image,
                updated_at,
                parseInt(data.status) === 1 || data.status == true ? 1 : 0,
                data.contact,
                1,
                id
            ],
            (error, result) => {
                if (error) return callback(error)
                return callback(null, result)
            }
        )
    },
    changePassword: (id, data, callback) => {
        pool.query(
            `UPDATE user set password=? where id = ?`,
            [
                data.password,
                id
            ],
            (error, result) => {
                if (error) return callback(error)
                return callback(null, result)
            }
        )
    },
    deleteUser: (id, callback) => {
        pool.query(
            `DELETE from user where id = ?`,
            [id],
            (error, result) => {
                if (error) return callback(error)
                return callback(null, result)
            }
        )
    },
    searchUser: (query, callback) => {
        pool.query(
            `SELECT id, name, username, email, role, image, contact, created_at, updated_at, status FROM user WHERE CONCAT(name, username) LIKE (?)`,
            [`%${query}%`],
            (error, result) => {
                if (error) return callback(error)
                return callback(null, result)
            }
        )
    }
}